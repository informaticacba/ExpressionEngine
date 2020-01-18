<?php
/**
 * This source file is part of the open source project
 * ExpressionEngine (https://expressionengine.com)
 *
 * @link      https://expressionengine.com/
 * @copyright Copyright (c) 2003-2019, EllisLab Corp. (https://ellislab.com)
 * @license   https://expressionengine.com/license Licensed under Apache License, Version 2.0
 */

namespace EllisLab\ExpressionEngine\Model\Status;

use EllisLab\ExpressionEngine\Service\Model\Model;
use Mexitek\PHPColors\Color;

/**
 * Status Model
 */
class Status extends Model {

	protected static $_primary_key = 'status_id';
	protected static $_table_name = 'statuses';

	protected static $_hook_id = 'status';

	protected static $_typed_columns = array(
		'site_id'         => 'int',
		'group_id'        => 'int',
		'status_order'    => 'int'
	);

	protected static $_relationships = array(
		'Channels' => array(
			'type' => 'hasAndBelongsToMany',
			'model' => 'Channel',
			'pivot' => array(
				'table' => 'channels_statuses'
			),
			'weak' => TRUE,
		),
		'ChannelEntries' => [
			'type' => 'hasMany',
			'model' => 'ChannelEntry',
			'weak' => TRUE
		],
		'Site' => array(
			'type' => 'BelongsTo'
		),
		'Roles' => array(
			'type' => 'hasAndBelongsToMany',
			'model' => 'Role',
			'pivot' => array(
				'table' => 'statuses_roles',
				'left' => 'status_id',
				'right' => 'role_id'
			)
		)
	);

	protected static $_validation_rules = array(
		'status' => 'required|unique',
		'highlight' => 'required|hexColor'
	);

	protected static $_events = array(
		'beforeInsert'
	);

	protected $status_id;
	protected $status;
	protected $status_order;
	protected $highlight;

	/**
	 * Ensures the highlight field has a default value
	 *
	 * @param str $name The name of the property to fetch
	 * @return str The value of the property
	 */
	protected function get__highlight()
	{
		// Old data from before validation may be invalid
		$valid = (bool) preg_match('/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $this->highlight);

		return $valid ? $this->highlight : '000000';
	}

	/**
	 * New statuses get appended
	 */
	public function onBeforeInsert()
	{
		$status_order = $this->getProperty('status_order');

		if (empty($status_order))
		{
			$count = $this->getModelFacade()->get('Status')->count();
			$this->setProperty('status_order', $count + 1);
		}
	}

	/**
	 * Returns the value and rendered label for option select input display
	 *
	 * @param  array $use_ids [default FALSE]
	 * @return array option component array
	 */
	public function getSelectOptionComponent($use_ids = false) {
		$status_option = [
			'value' => ($use_ids) ? $this->status_id : $this->status,
			'label' => $this->renderTag()
		];

		return $status_option;
	}

	public function renderTag() {
		$status_name = ($this->status == 'closed' OR $this->status == 'open') ? lang($this->status) : $this->status;

		$status_class = str_replace(' ', '_', strtolower($this->status));

		$status_component_style = [];

		if ( ! in_array($this->status, array('open', 'closed')) && $this->highlight != '')
		{
			$highlight = new Color($this->highlight);
			$foreground = ($highlight->isLight()) ? $highlight->darken(80) : $highlight->lighten(80);

			$status_component_style = [
				'background-color' => '#' . $this->highlight,
				'border-color' => '#' . $this->highlight,
				'color' => '#' . $foreground,
			];
		}

		$vars = [
			'label' => $status_name,
			'class' => $status_class,
			'styles' => $status_component_style
		];

		return ee('View')->make('_shared/status-tag')->render($vars);
	}
}

// EOF
