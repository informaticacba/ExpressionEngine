/*!
 * This source file is part of the open source project
 * ExpressionEngine (https://expressionengine.com)
 *
 * @link      https://expressionengine.com/
 * @copyright Copyright (c) 2003-2021, Packet Tide, LLC (https://www.packettide.com)
 * @license   https://expressionengine.com/license Licensed under Apache License, Version 2.0
 */

(function($) {

"use strict";

var Conditional = window.Conditional = {

	// Event handlers stored here, direct access outside only from
	// Conditional.Publish class
	_eventHandlers: [],

	/**
	 * Binds an event to a fieldtype
	 *
	 * Available events are:
	 * 'display' - When a row is displayed
	 * 'remove' - When a row is deleted
	 *
	 * @param	{string}	fieldtypeName	Class name of fieldtype so the
	 *				correct cell object can be passed to the handler
	 * @param	{string}	action			Name of action
	 * @param	{func}		func			Callback function for event
	 */
	on: function(fieldtypeName, action, func) {
		if (this._eventHandlers[action] == undefined) {
			this._eventHandlers[action] = [];
		}

		// Each fieldtype gets one method per handler
		this._eventHandlers[action][fieldtypeName] = func;
	}
};

/**
 * Conditional Publish class
 *
 * @param	{string}	field		Selector of table to instantiate as a Conditional
 */
Conditional.Publish = function(field, settings) {
	this.root = $(field);
	this.mainParentContainer = this.root.parents('#fieldset-condition_fields');
	this.blankSet = $('.conditionset-temlates-row', this.mainParentContainer);
	this.activeSet = this.root.not(this.blankSet);
	this.setParent = $('#fieldset-condition_fields').find('.field-conditionset-wrapper');
	this.blankRow = $('.rule-blank-row', this.activeSet);
	this.rowContainer = this.activeSet.find('.rules');
	this.addButtonToolbar = $('[rel=add_row]', this.activeSet);
	this.deleteButtonsSelector = '.delete_rule [rel=remove_row]';
	this.deleteSetButtonsSelector = '.remove-set';
	this.rowSelector = '.rule';
	this.cellSelector = '.rule > div';

	this.init();

	this.eventHandlers = [];
}

Conditional.Publish.prototype = {

	init: function() {
		// Store the original row count so we can properly increment new
		// row placeholder IDs in _addRow()
		this.original_row_count = this._getRowsInSet().length;
		this.original_set_count = this._getSets().length;

		if (!Object.keys(EE.conditionData).length) {
			this._firstCloneSet();
		}

		this._bindDeleteSetButton();
		this._bindDeleteButton();
		this._bindAddButton();

		if (Object.keys(EE.conditionData).length) {
			this._showSavedData();
			this._bindAddSetButton();
		}


		// Disable input elements in our blank template container so they
		// don't get submitted on form submission
		this.blankRow.find(':input').attr('disabled', 'disabled');
	},

	_getRowsInSet: function() {
		return this.rowContainer.children(this.rowSelector).not(this.blankRow);
	},

	_getSets: function() {
		return this.mainParentContainer.find(this.activeSet);
	},

	_checkHiddenEl: function() {
		var notEmptySet = $('#fieldset-condition_fields .field-conditionset-wrapper').find('.conditionset-item:not(.hidden)');
		var hiddenInput = notEmptySet.find('.rule.hidden');

		$.each(hiddenInput, function(key, value) {

			// check if input in hidden container was init and have attr disable
			var timer = setInterval(function() {
				if ($(value).find('input').prop('disabled')) {
					clearInterval(timer);
				} else {
					$(value).find('input').attr('disabled', 'disabled');
				}
			},50);
		});
	},

	/**
	 * Add and Binds click listener to Add / Delete ROW buttons to add/delete the rows
	 */
	_addRuleRow: function(cloneElementParent) {
		var that = this;

		// Clone our blank row
		var el = cloneElementParent.find('.rule-blank-row').clone();

		el.removeClass('rule-blank-row');
		el.removeClass('hidden');

		// Increment namespacing on inputs
		this.original_row_count++;

		el.html(
			el.html().replace(
				RegExp('new_rule_row_[0-9]{1,}', 'g'),
				'new_rule_row_' + this.original_row_count
			)
		);

		el.html(
			el.html().replace(
				RegExp('new_row_[0-9]{1,}', 'g'),
				'new_row_' + this.original_row_count
			)
		);

		// Add the new row ID to the field data
		$('> '+this.cellSelector, el).attr(
			'data-new-rule-row-id',
			'new_rule_row_' + this.original_row_count
		);

		// Append the row to the end of the row container
		cloneElementParent.find('.rules').append(el);

		if ($(cloneElementParent).find('.rule:not(.hidden)').length > 1) {
			$(cloneElementParent).find('.rule:not(.hidden) [rel="remove_row"]').show();
			$(cloneElementParent).find('.rule:not(.hidden) [rel="remove_row"]').prop('disabled', false);
		} else {
			$(cloneElementParent).find('.rule:not(.hidden) [rel="remove_row"]').hide();
		}

		that._checkHiddenEl();

		// Bind the new row's inputs to AJAX form validation
		if (EE.cp && EE.cp.formValidation !== undefined) {
			EE.cp.formValidation.bindInputs(el);
		}

		return el;
	},

	_bindAddButton: function() {
		var that = this;
		$('body').on('click', '.condition-btn', function(event) {
			var cloneElementParent = $(this).parents('.field-conditionset');
			event.preventDefault();
			that._addRuleRow(cloneElementParent);
			Dropdown.renderFields();
		});
	},

	_bindDeleteButton: function() {
		var that = this;

		$('body').on('click', that.deleteButtonsSelector, function(event) {
			event.preventDefault();

			var row = $(this).parents('.rule');
			var rowParent = row.parents('.rules');
			// Remove the row
			row.remove();

			if (rowParent.find('.rule:not(.hidden)').length == 1) {
				rowParent.find('.rule:not(.hidden)').find('[rel="remove_row"]').hide();
			}
		});
	},

	/**
	 * Add and Binds click listener to Add / Delete Set buttons to add/delete the set
	 */

	_addSetBlock: function() {
		// Clone our blank row
		var that = this

		var set = this.blankSet.clone();

		set.removeClass('conditionset-temlates-row');
		set.removeClass('hidden');

		// Increment namespacing on inputs
		this.original_set_count++;

		set.html(
			set.html().replace(
				RegExp('new_conditionset_block[0-9]{1,}', 'g'),
				'new_conditionset_block_' + this.original_set_count
			).replace(
				RegExp('new_set_[0-9]{1,}', 'g'),
				'new_set_' + this.original_set_count
			)
		);

		// Add the new row ID to the field data
		$(set).attr(
			'id',
			'new_conditionset_block_' + this.original_set_count
		);

		// Enable remove button
		set.find('[rel=remove_row]').removeAttr('disabled');

		// Append the row to the end of the row container

		this.setParent.append(set);

		$(set).find('.condition-btn').trigger('click');

		// // Bind the new row's inputs to AJAX form validation
		if (EE.cp && EE.cp.formValidation !== undefined) {
			EE.cp.formValidation.bindInputs(set);
		}

		return set;
	},

	_bindAddSetButton: function() {
		var that = this;

		$('body').on('click', 'a.add-set', function(event) {
			event.preventDefault();
			that._addSetBlock();

			if (that.original_set_count > 1) {
				$('.remove-set').show();
			}

			Dropdown.renderFields();
		});
	},

	_bindDeleteSetButton: function() {
		var that = this;

		$('body').on('click', that.deleteSetButtonsSelector, function(event) {
			event.preventDefault();

			var set = $(this).parents('.conditionset-item');

			// Remove the set
			set.remove();
			var set_count = that.mainParentContainer.find('.conditionset-item').not('.conditionset-temlates-row');

			if (set_count.length == 1) {
				$('.remove-set', set_count).hide();
			}
		});
	},

	/**
	 * Check and clone set if conditions have not yet been added
	 */
	_firstCloneSet: function() {
		var that = this;

		if (this.original_set_count == 0) {
			this._bindAddSetButton();

			this._addSetBlock();
			var parentSet = $('.conditionset-item:not(.hidden)');

			var newTimer = setInterval(function() {
				if ($(parentSet).find('.condition-btn').length) {
					$(parentSet).find('.condition-btn').trigger('click');
					clearInterval(newTimer);
				}
			},20);
		}
	},

	/**
	 * Show saved data on FE
	 */
	_showSavedData: function() {
		var that = this;

		if (Object.keys(EE.conditionData).length) {
			let setId;
			let condition_field_id;
			let evaluation_rule;
			let value;
			let match;

			console.log(EE.conditionData)
			$.each(EE.conditionData, function(key, value) {
				match = value['match'];

				$.each(value['conditions'], function(i, el) {
					setId = el['condition_set_id'];
					condition_field_id = el['condition_field_id'];
					evaluation_rule = el['evaluation_rule'];
					value = el['value'];

					that._addSavedSetBlock(match, setId, condition_field_id, evaluation_rule, value);
				})
			})
		}

		that._savedSets();
	},

	_addSavedSetBlock: function(match, setId, condition_field_id, evaluation_rule, value) {
		// Clone our blank row
		var that = this;

		var savedSet = this.blankSet.clone();

		savedSet.removeClass('conditionset-temlates-row');
		savedSet.removeClass('hidden');

		savedSet.html(
			savedSet.html().replace(
				RegExp('new_conditionset_block[0-9]{1,}', 'g'),
				'new_conditionset_block_' + setId
			).replace(
				RegExp('new_set_[0-9]{1,}', 'g'),
				'new_set_' + setId
			)
		);

		// Add the new row ID to the field data
		$(savedSet).attr(
			'id',
			'new_conditionset_block_' + setId
		);

		// Enable remove button
		savedSet.find('[rel=remove_row]').removeAttr('disabled');

		var match_name = 'condition_set[new_set_'+setId+'][match]';
		var operatorMatch = {
			"all": 'all',
			"any": 'any'
		}
		var matchOptions = {
			name: match_name,
			items: operatorMatch,
			initialItems: operatorMatch,
			selected: match,
			disabled: false,
			emptyText: "Select a Field",
		};

		var dataMatchReact = btoa(JSON.stringify(matchOptions));

		savedSet.find('.field-conditionset .condition-match-field').remove();
		savedSet.find('.field-conditionset .match-react-element').append('<div data-input-value="'+match_name+'" class="condition-match-field" data-dropdown-react='+dataMatchReact+'></div>');

		// Append the row to the end of the row container
		this.setParent.append(savedSet);
		Dropdown.renderFields();

		that._addSavedRuleRow(savedSet, setId, condition_field_id, evaluation_rule, value);

		return savedSet;
	},
	_addSavedRuleRow: function(savedSet, setId, condition_field_id, evaluation_rule, value) {
		var that = this;

		// Clone our blank row
		var el = savedSet.find('.rule-blank-row').clone();

		el.removeClass('rule-blank-row');
		el.removeClass('hidden');

		el.html(
			el.html().replace(
				RegExp('new_rule_row_[0-9]{1,}', 'g'),
				'new_rule_row_' + setId
			)
		);

		el.html(
			el.html().replace(
				RegExp('new_row_[0-9]{1,}', 'g'),
				'new_row_' + setId
			)
		);

		// Add the new row ID to the field data
		$('> '+this.cellSelector, el).attr(
			'data-new-rule-row-id',
			'new_rule_row_' + setId
		);

		var condition_field_name = el.find('.condition-rule-field-wrap input').attr('name');
		var operator_name = el.find('.condition-rule-field-wrap .condition-rule-field').attr('data-input-value').replace('condition_field_id', 'evaluation_rule');
		var value_name = el.find('.condition-rule-field-wrap .condition-rule-field').attr('data-input-value').replace('condition_field_id', 'value');

		var ruleOperator = {};
		var operatorType = {};

		$.each(EE.fields, function(i, val) {
			ruleOperator[i] =  val['field_label'];

			if (i == condition_field_id) {
				$.each(val['evaluationRules'], function(item, value){
					operatorType[item] =  value['text'];
				});
			}
		});

		var ruleOptions = {
			name: condition_field_name,
			items: ruleOperator,
			initialItems: ruleOperator,
			selected: condition_field_id,
			disabled: false,
			tooMany: 20,
			limit: 100,
			groupToggle: null,
			emptyText: "Select a Field",
			conditionalRule: 'rule',
		};

		var operatorOptions = {
			name: operator_name,
			items: operatorType,
			initialItems: operatorType,
			selected: evaluation_rule,
			disabled: false,
			tooMany: 20,
			limit: 100,
			groupToggle: null,
			emptyText: "Select a Field",
			conditionalRule: 'operator',
		};

		var dataRuleOptionsReact = btoa(JSON.stringify(ruleOptions));
		var dataOperatorOptionsReact = btoa(JSON.stringify(operatorOptions));

		el.find('.condition-rule-field-wrap .condition-rule-field').remove();
		el.find('.condition-rule-operator-wrap .condition-rule-operator').remove();

		el.find('.condition-rule-field-wrap').append('<div data-input-value="'+condition_field_name+'" class="condition-rule-operator" data-dropdown-react='+dataRuleOptionsReact+'></div>');
		el.find('.condition-rule-operator-wrap').append('<div data-input-value="'+operator_name+'" class="condition-rule-operator" data-dropdown-react='+dataOperatorOptionsReact+'></div>');

		if (value.length) {
			el.find('.condition-rule-value-wrap input').attr('name', value_name);
			el.find('.condition-rule-value-wrap input').attr('value', value);
		} else {
			el.find('.condition-rule-value-wrap input').hide();
		}

		el.find('.condition-rule-operator-wrap .empty-select').hide();
		el.find('.condition-rule-operator-wrap .condition-rule-operator').show();

		// Append the row to the end of the row container
		savedSet.find('.rules').append(el);

		Dropdown.renderFields();

		if ($(savedSet).find('.rule:not(.hidden)').length > 1) {
			$(savedSet).find('.rule:not(.hidden) [rel="remove_row"]').show();
			$(savedSet).find('.rule:not(.hidden) [rel="remove_row"]').prop('disabled', false);
		} else {
			$(savedSet).find('.rule:not(.hidden) [rel="remove_row"]').hide();
		}

		that._checkHiddenEl();

		return el;
	},
	_savedSets: function() {
		var savedSets = $('#fieldset-condition_fields .conditionset-item:not(.hidden)');

		if (savedSets.length > 1) {
			$.each(savedSets, function(item, el) {
				$(this).find('.remove-set').show();
			})
		}
	}
}

function initRules () {
	var el = $('.conditionset-item');
	return new Conditional.Publish(el);
}


$(document).ready(function() {
	initRules();

	function checkFieldType(fieldName) {
		var fieldType;

		$.each(EE.fields, function(i, val) {
			if (fieldName == val['field_label']) {
				fieldType = val['field_type'];
			}
		});
		return fieldType;
	}

	EE.cp.show_hide_rule_operator_field = function(element, input) {

		if ( ! $(element).size()) {
			return;
		}

		var fieldName = element.label;
		var parensRow = $(input).parents('.rule');
		var evaluationRules;
		var operator = {};

		parensRow.find('.condition-rule-value-wrap input').removeAttr('disabled');
		parensRow.find('.condition-rule-operator-wrap .condition-rule-operator').remove();
		parensRow.find('.condition-rule-value-wrap input').remove();

		$.each(EE.fields, function(i, val) {
			if (fieldName == val['field_label']) {
				evaluationRules = val['evaluationRules'];
			}
		});

		var fieldType = checkFieldType(fieldName);

		$.each(evaluationRules, function(item, value){
			operator[item] =  value['text'];
		});

		var selectedItem = Object.keys(operator)[0];

		var evaluation_rule_name = parensRow.find('.condition-rule-field-wrap .condition-rule-field').attr('data-input-value').replace('condition_field_id', 'evaluation_rule');
		var value_name = parensRow.find('.condition-rule-field-wrap .condition-rule-field').attr('data-input-value').replace('condition_field_id', 'value');

		var options = {
			name: evaluation_rule_name,
			items: operator,
			initialItems: operator,
			selected: selectedItem,
			disabled: false,
			tooMany: 20,
			limit: 100,
			groupToggle: null,
			emptyText: "Select a Field",
			conditionalRule: 'operator',
		};

		var dataDropdownReact = btoa(JSON.stringify(options));

		parensRow.find('.condition-rule-operator-wrap').append('<div data-input-value="'+evaluation_rule_name+'" class="condition-rule-operator" data-dropdown-react='+dataDropdownReact+'></div>');
		parensRow.find('.condition-rule-value-wrap').append('<input type="text" name="'+value_name+'">');

		Dropdown.renderFields();
		parensRow.find('.condition-rule-operator-wrap .empty-select').hide();
		parensRow.find('.condition-rule-operator-wrap .condition-rule-operator').show();

		EE.cp.show_hide_value_field(fieldType, selectedItem, parensRow);
	}

	EE.cp.check_operator_value = function(item, input) {
		var operatorVal = item.value;
		var parensRow = $(input).parents('.rule');
		var ruleLabel = parensRow.find('.condition-rule-field-wrap .select__dropdown-item--selected span:not(".short-name")').text();

		var rulefieldType = checkFieldType(ruleLabel);

		EE.cp.show_hide_value_field(rulefieldType, operatorVal, parensRow);
	} 

	EE.cp.show_hide_value_field = function(firstSelectVal, secondSelectVal, parentRow) {
		var evaluationRules;

		$.each(EE.fields, function(i, val) {
			if (firstSelectVal == val['field_type']) {
				evaluationRules = val['evaluationRules'];
			}
		});

		$.each(evaluationRules, function(el, val) {
			if (secondSelectVal == el) {
				if (val['type'] == null) {
					parentRow.find('.condition-rule-value-wrap').children().hide();
				} else {
					parentRow.find('.condition-rule-value-wrap').children().show();
				}
			}
		})
	}

	$('body').on('mousemove', '.condition-rule-field-wrap .button-segment', function(e) {
		var X = e.offsetX;
		var Y = e.offsetY;
		var top = Y + 20 + 'px';
		var left = X + 20 + 'px';
		if ($(this).find('.tooltiptext').length) {
			$(this).find('.tooltiptext').css({
				display: 'block',
				top: top,
				left: left
			});
		}
	});

	$('body').on('mouseout', '.condition-rule-field-wrap .button-segment', function(e) {
		if ($(this).find('.tooltiptext').length) {
			$(this).find('.tooltiptext').css({display: "none"});
		}
	});
});

})(jQuery);
