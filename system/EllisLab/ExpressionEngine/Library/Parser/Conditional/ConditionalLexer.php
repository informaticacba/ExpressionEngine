<?php

namespace EllisLab\ExpressionEngine\Library\Parser\Conditional;

use EllisLab\ExpressionEngine\Library\Parser\AbstractLexer;
use EllisLab\ExpressionEngine\Library\Parser\Conditional\Exception\ConditionalLexerException;

/**
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		EllisLab Dev Team
 * @copyright	Copyright (c) 2003 - 2014, EllisLab, Inc.
 * @license		http://ellislab.com/expressionengine/user-guide/license.html
 * @link		http://ellislab.com
 * @since		Version 2.9.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * ExpressionEngine Conditional Lexer Class
 *
 * @package		ExpressionEngine
 * @subpackage	Core
 * @category	Core
 * @author		EllisLab Dev Team
 * @link		http://ellislab.com
 */
class ConditionalLexer extends AbstractLexer {

	/**
	 * The main token array
	 */
	private $tokens;

	/**
	 * The state stack
	 */
	private $stack;

	/**
	 * The current state / top of the stack
	 */
	private $patterns = array(
		'variable'	=> '\w*([a-zA-Z]([\w:-]+\w)?|(\w[\w:-]+)?[a-zA-Z])\w*',
		'number'	=> '-?([0-9]*\.[0-9]+|[0-9]+\.[0-9]*|[0-9]+)'
	);

	/**
	 * Available tokens
	 *
	 * This is for the future where we will build tokens by number
	 *
	 * private $token_names = array(
	 * 	'TEMPLATE_STRING',	// generic
	 * 	'IF',				// {if
	 * 	'ELSE',				// {if:else
	 * 	'ELSEIF',			// {if:elseif
	 * 	'ENDIF',			// {/if}
	 * 	'ENDCOND',			// } at the end of an if
	 * 	'STRING',			// literal string "foo", or 'foo'. The value does not include quotes
	 * 	'NUMBER',			// literal number
	 * 	'VARIABLE',
	 * 	'OPERATOR',			// an operator from the $operators array
	 * 	'MISC',				// other stuff, usually illegal when safety on
	 * 	'LP',				// (
	 * 	'RP',				// )
	 * 	'WHITESPACE',		// \s\r\n\t
	 * 	'BOOL',				// TRUE or FALSE (case insensitive)
	 * 	'TAG',				// {exp:foo:bar}
	 * 	'EOS'				// end of string
	 * );
	 */

	private $operators = array(
		'||', '&&', '**',
		'==', '!=', '<=', '>=', '<>', '<', '>',
		'%', '+', '-', '*', '/',
		'.', '!', '^'
	);

	private $ascii_map = array();

	public function __construct()
	{

	}


	/**
	 * Finds conditionals an returns a token stream for the entire template, with
	 * conditional specific tokens.
	 *
	 * @param $str The template chunk to look through
	 * @return Array [new chunk, new variables]
	 */
	public function tokenize($str)
	{
		if ($str == '')
		{
			return array();
		}

		$this->str = $str;
		$this->tokens = array();

		$this->pushState('OK');

		while ($this->str != '')
		{
			// go to the next LD
			$buffer = $this->seekTo('{');

			// anything we hit in the meantime is template string
			$this->addToken('TEMPLATE_STRING', $buffer);

			// if we can create an {if or {if:elseif token from this point,
			// then we need to move into the statement.
			if ($this->tokenizeIfTags())
			{
				$this->tokenizeIFStatement();
			}
		}

		$this->addToken('TEMPLATE_STRING', $this->str);
		$this->addToken('EOS', TRUE);

		return $this->tokens;
	}

	/**
	 * Finds tokens specific to conditional boolean statements.
	 *
	 * @param $str The template chunk to look through
	 * @return Array [new chunk, new variables]
	 */
	private function tokenizeIfTags()
	{
		// if we hit a closing if, we need to deal with that
		if ($this->peek(5) == '{/if}')
		{
			$this->addToken('ENDIF', $this->move(5));
			return FALSE;
		}

		// potential opening ifs
		$potential_if = (string) $this->peekRegex('{if(:else(\s?}|if\s)|\s)');
		$trimmed_if = trim($potential_if);

		$parts = array(
			'{if'			=> 'IF',
			'{if:elseif'	=> 'ELSEIF',
			'{if:else}'		=> 'ELSE'
		);

		if (isset($parts[$trimmed_if]))
		{
			$token = $parts[$trimmed_if];

			$this->addToken(
				$token,
				$this->move(strlen($potential_if))
			);

			return ($token !== 'ELSE');
		}

		// {if: is a reserved prefix
		if ($this->peek(4) == '{if:')
		{
			throw new ConditionalLexerException('Conditional is invalid: "{if:" is reserverd for conditionals. Found: ' . $potential_if, 20);
		}

		$this->addToken('TEMPLATE_STRING', $this->next());
		return FALSE;
	}

	/**
	 * Finds tokens specific to conditional boolean statements.
	 *
	 */
	private function tokenizeIfStatement()
	{
		// No sense continuing if we cannot find a {/if}
		if (strpos($this->str, '{/if}') === FALSE)
		{
			throw new ConditionalLexerException('Conditional is invalid: missing a "{/if}".', 21);
		}

		// must be true at the end
		$valid_end = FALSE;

		$last_count = 0;

		while ($this->str != '')
		{
			$this->whitespace();

			if ($this->variable() || $this->number())
			{
				$this->whitespace();
			}

			$this->operators();

			$char = $this->peek();

			if ($char == '"' || $char == "'")
			{
				$this->tokenizeString($char);
			}
			elseif ($char == '(')
			{
				$this->next();
				$this->addToken('LP', '(');
			}
			elseif ($char == ')')
			{
				$this->next();
				$this->addToken('RP', ')');
			}
			elseif ($char == '{')  // Checking for balanced curly braces
			{
				$this->tag_buffer .= '{';

				$this->pushState('TAG');
				$this->next();
			}
			elseif ($char == '}')
			{
				$this->next();
				$this->popState();
				$top = $this->topState();

				if ($top === FALSE)
				{
					$valid_end = TRUE;
					break;
				}
				elseif ($top == 'OK')
				{
					$this->addToken('TAG', $this->tag_buffer.$char);
					$this->tag_buffer = '';
				}
			}

			$new_count = count($this->tokens);

			// when we don't know what to do with a character, we skip it
			// todo: save as misc?
			if ($last_count == $new_count && $this->topState() != 'TAG')
			{
				$this->next();
			}

			$last_count = $new_count;
		}

		// Not in an end state, or curly braces are unbalanced, "error" out
		if ( ! $valid_end)
		{
			throw new ConditionalLexerException('Conditional is invalid: not in an end state or unbalanced curly braces.');
		}

		$this->addToken('ENDCOND', '}');
	}

	public function variable()
	{
		$result = $this->peekRegex($this->patterns['variable']);

		if (isset($result))
		{
			$this->move(strlen($result));
			$this->addToken('VARIABLE', $result);
			return TRUE;
		}

		return FALSE;
	}

	public function number()
	{
		$result = $this->peekRegex($this->patterns['number']);

		if (isset($result))
		{
			$this->move(strlen($result));
			$this->addToken('NUMBER', $result);
			return TRUE;
		}

		return FALSE;
	}

	public function whitespace()
	{
		if ($ws = $this->peekRegex('\s+'))
		{
			$this->move(strlen($ws));
			$this->addToken('WHITESPACE', $ws);
		}
	}

	public function tokenizeString($open_quote)
	{
		$open_quote = $this->next();

		$str = '';
		$backslash = '\\';
		$escapable = array('\\', "'", '"');

		// Add everything up to the next backslash or closing quote
		// and then check if we're done or just escaping.
		while ($add = $this->seekTo($open_quote.$backslash))
		{
			$str .= $add;

			if ($open_quote == $this->next())
			{
				break;
			}

			$next = $this->next();

			if ( ! in_array($next, $escapable))
			{
				$str .= $backslash;
			}

			$str .= $next;
		}

		// if we're in a tag we need to keep the quotes
		if ($this->topState() == 'TAG')
		{
			$this->tag_buffer .= $open_quote.$str.$open_quote;
		}
		else
		{
			$this->addToken('STRING', $str);
		}
	}

	/**
	 * Add token to the token stream
	 *
	 * @param string $type The type of token being added
	 * @param string $$value The value of the token being added
	 */
	public function addToken($type, $value)
	{
		if ($this->topState() == 'TAG')
		{
			$this->tag_buffer .= $value;
			return;
		}

		// Special cases for Variables
		if ($type == 'VARIABLE')
		{
			$uppercase_value = strtoupper($value);

			switch ($uppercase_value)
			{
				case 'TRUE':
				case 'FALSE':
					$type = 'BOOL';
					break;
				case 'XOR':
				case 'AND':
				case 'OR':
					$type = 'OPERATOR';
					break;
			}
		}

		// Always store strings, even empty ones
		if ($value != '' || $type == 'STRING')
		{
			$this->tokens[] = array($type, $value);
		}
	}

	private function operators()
	{
		// Consume until we stop seeing operators
		$operator_length = strspn($this->str, implode('', $this->operators));

		if ($operator_length == 0)
		{
			return FALSE;
		}

		$operator_buffer = $this->move($operator_length);

		// Check for any trailing - meant to indicate negativity
		// but only if it is trailing and not standalone, a -
		// on its own is subtraction

		$last_char = substr($operator_buffer, -1);

		if (strlen($operator_buffer) == 1 && $last_char == '.')
		{
			if (ctype_digit($this->peek()))
			{
				$this->str = substr($operator_buffer, -1).$this->str; // Put it back.
				return FALSE;
			}
		}
		elseif (strlen($operator_buffer) > 1)
		{
			if ($last_char == '-' || $last_char == '.')
			{
				if (ctype_digit($this->peek()))
				{
					$this->str = substr($operator_buffer, -1).$this->str; // Put it back.
					$operator_buffer = substr($operator_buffer, 0, -1);
				}
			}
		}

		if (in_array($operator_buffer, $this->operators))
		{
			$this->addToken('OPERATOR', $operator_buffer);
		}
		else
		{
			$this->addToken('MISC', $operator_buffer);
		}

		return TRUE;
	}

	/**
	 * Push a state onto the stack
	 *
	 * We use this to keep track of when we're in a tag state.
	 *
	 * @param string $state Name of the state to push
	 */
	private function pushState($state)
	{
		$this->stack[] = $state;
	}

	/**
	 * Pop a state off the stack
	 *
	 * @return The popped state
	 */
	private function popState()
	{
		return array_pop($this->stack);
	}

	/**
	 * Get the top state.
	 *
	 * We use this to keep track of when we're in a tag state.
	 *
	 * @param string $state Name of the state to push
	 */
	private function topState()
	{
		return end($this->stack);
	}
}

/* End of file ConditionalLexer.php */
/* Location: ./system/expressionengine/libraries/template/ConditionalLexer.php */