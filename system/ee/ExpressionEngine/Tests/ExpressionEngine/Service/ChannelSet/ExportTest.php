<?php
/**
 * This source file is part of the open source project
 * ExpressionEngine (https://expressionengine.com)
 *
 * @link      https://expressionengine.com/
 * @copyright Copyright (c) 2003-2022, Packet Tide, LLC (https://www.packettide.com)
 * @license   https://expressionengine.com/license Licensed under Apache License, Version 2.0
 */

namespace ExpressionEngine\Tests\Service\ChannelSet;

use ExpressionEngine\Service\ChannelSet\Export;
use PHPUnit\Framework\TestCase;

class ExportTest extends TestCase
{
    private $export;

    public function setUp(): void
    {
        $this->export = new Export();
    }

    protected static function call($name)
    {
        $export = new Export();
        $method = new \ReflectionMethod($export, $name);
        $method->setAccessible(true);

        $args = func_get_args();
        array_shift($args);
        array_unshift($args, $export);

        return call_user_func_array(array($method, 'invoke'), $args);
    }

    public function testExportFileFieldSettings()
    {
        $channel_field = new \StdClass();
        $channel_field->field_settings = array(
            'num_existing' => 50,
            'show_existing' => 'y',
            'field_content_type' => 'all',
            'allowed_directories' => 'all'
        );

        $file_field_settings = self::call('exportFileFieldSettings', $channel_field);
        $this->assertEquals(
            $file_field_settings->num_existing,
            $channel_field->field_settings['num_existing']
        );
        $this->assertEquals(
            $file_field_settings->show_existing,
            $channel_field->field_settings['show_existing']
        );
        $this->assertEquals(
            $file_field_settings->field_content_type,
            $channel_field->field_settings['field_content_type']
        );
        $this->assertEquals(
            $file_field_settings->allowed_directories,
            $channel_field->field_settings['allowed_directories']
        );
    }

    public function testExportFileFieldSettingsWithSpecifiedDirectories()
    {
        $this->markTestSkipped('exportFielFieldSettings is not testable with allowed_directories.');

        $channel_field = new \StdClass();
        $channel_field->field_settings = array(
            'num_existing' => 50,
            'show_existing' => 'y',
            'field_content_type' => 'all',
            'allowed_directories' => '1'
        );

        $file_field_settings = self::call('exportFileFieldSettings', $channel_field);
        $this->assertEquals(
            $file_field_settings->num_existing,
            $channel_field->field_settings['num_existing']
        );
        $this->assertEquals(
            $file_field_settings->show_existing,
            $channel_field->field_settings['show_existing']
        );
        $this->assertEquals(
            $file_field_settings->field_content_type,
            $channel_field->field_settings['field_content_type']
        );
        $this->assertEquals(
            $file_field_settings->allowed_directories,
            $channel_field->field_settings['allowed_directories']
        );
    }
}
