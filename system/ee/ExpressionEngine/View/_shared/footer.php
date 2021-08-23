                <div id="output_profiler"></div>
            </div>
        </section>
    </div>

    <div class="dropdown app-pro-validation" data-dropdown="app-pro-validation-dropdown">
      <h5>ExpressionEngine Pro</h5>
      <p class="pro-message"> Your license is: <em>Invalid</em></p>

      <div class="app-pro-validation-actions">

        <!-- Only display button IF site license is empty: -->
        <a class="button button--default button--small" href="">Enter Site License</a>

        <a class="button button--primary button--small" href="">Purchase Pro License</a>

      </div>
    </div>

        <div class="dropdown app-about" data-dropdown="app-about-dropdown">
            <div class="app-about__title">ExpressionEngine <span class="float-right"><?=$formatted_version?></span></div>
            <div class="app-about__subtitle">
                &copy;<?=date('Y')?> <a href="https://expressionengine.com/" rel="external noreferrer">Packet Tide</a>, LLC.
                <span class="float-right"><?=$ee_build_date?></span>
            </div>

            <?php if (ee('Permission')->can('access_footer_new_ticket')): ?>
            <a href="https://expressionengine.com/support" class="dropdown__link app-about__link app-about__support-link"><i class="fas fa-life-ring fa-fw"></i> <?=lang('support')?></a>
            <?php endif ?>

            <?php if (ee('Permission')->can('access_footer_report_bug')): ?>
                <a href="https://github.com/ExpressionEngine/ExpressionEngine/issues/new?template=1-EE6-bug-report.md" class="dropdown__link app-about__link app-about__bug-link" rel="external noreferrer"><i class="fas fa-bug fa-fw"></i> <?=lang('report_bug')?></a>
            <?php endif ?>
            <?php if (ee('Permission')->can('access_footer_user_guide')): ?>
                <a href="<?=DOC_URL?>" class="dropdown__link app-about__link app-about__user-guide-link" rel="external noreferrer"><i class="fas fa-book fa-fw"></i> <?=lang('user_guide')?></a>
            <?php endif; ?>
            <?php if ($show_news_button): ?>
                <a href="<?=ee('CP/URL')->make('homepage/show-changelog')?>" class="dropdown__link app-about__link app-about__whats-new-link" rel="external"><i class="fas fa-gift fa-fw"></i> <?=lang('whats_new')?></a>
            <?php endif ?>

            <?php if (ee('Permission')->isSuperAdmin()): ?>
                <div class="app-about__status app-about__status--checking">
                    <?=lang('checking_for_updates')?>
                </div>
                <div class="app-about__status app-about__status--update-to-date hidden">
                    <?=lang('up_to_date')?>
                </div>
                <div class="app-about__status app-about__status--update hidden">
                    <?=lang('out_of_date_upgrade')?>
                    <a data-post-url="<?=ee('CP/URL', 'updater')?>" class="button button--primary"><?=lang('update_btn')?></a>
                    <div class="app-about__status-version"></div>
                </div>
                <div class="app-about__status app-about__status--update-vital hidden">
                    <?=lang('out_of_date_recommended')?>
                    <a data-post-url="<?=ee('CP/URL', 'updater')?>" class="button button--primary"><?=lang('update_btn')?></a>
                    <div class="app-about__status-version"></div>
                </div>
                <div class="app-about__status app-about__status--update-major hidden">
                    <?=lang('out_of_date_upgrade_major')?>

                    <div class="app-about__status--update_major_version <?=isset(ee()->view->major_update) ? '' : 'hidden'?>">
                        <?=form_open(ee('CP/URL')->make('updater/authenticate'), ['name' => 'one_click_major_update_confirm'])?>
                            <input type="hidden" name="username" value="<?=form_prep(ee()->session->userdata('username'))?>">
                            <fieldset>
                                <label><?=lang('one_click_major_update_instructions')?></label>
                                <div class="field-control">
                                    <input type="password" name="password" value="" id="upgrade-confirm-password">
                                </div>
                            </fieldset>
                            <div class="app-about__status--update_credentials_error hidden">
                                <p><?=lang('one_click_major_update_confirm_error')?></p>
                            </div>
                            <div class="">
                                <?=form_submit('submit-upgrade', lang('btn_authenticate'), 'class="button button--primary" data-submit-text="' . lang('btn_authenticate') . '" data-work-text="' . lang('authenticating') . '"')?>
                            </div>
                        <?=form_close()?>
                    </div>

                    <div class="app-about__status--update_regular <?=isset(ee()->view->major_update) ? 'hidden' : ''?>">
                        <a data-post-url="<?=ee('CP/URL', 'updater')?>" class="button button--primary"><?=lang('update_btn')?></a>
                    </div>
                    <div class="app-about__status-version"></div>
                </div>
            <?php endif ?>
        </div>

        <div class="overlay"></div>
        <div class="app-overlay"></div>

<?php if (isset($blocks['modals'])) {
    echo $blocks['modals'];
} ?>
<?php echo implode('', ee('CP/Modal')->getAllModals()); ?>

        <?=ee()->view->script_tag('jquery/jquery.js')?>
        <?php

        echo ee()->javascript->get_global();

        echo ee()->cp->render_footer_js();

        if (isset($_extra_library_src)) {
            echo $_extra_library_src;
        }

        echo ee()->javascript->script_foot();

        foreach (ee()->cp->get_foot() as $item) {
            echo $item . "\n";
        }

        $this->embed('ee:_shared/idle-modal');

        ?>

        <script type="text/javascript" src="<?=ee('CP/URL')->make('jumps/js')->compile()?>"></script>

        <div id="jump-menu" class="hidden<?php if (!isset($ee_cp_viewmode) || empty($ee_cp_viewmode)) {
            echo ' on-welcome';
        } ?>" style="display:none;">
            <div class="jump-menu">
                <div class="jump-menu__input-DISABLED hidden" id="jumpMenu1-DISABLED">
                    <input type="text" id="jumpEntry1-DISABLED" class="jump-to" placeholder="<?=lang('jump_menu_input')?>">
                </div>
                <div class="jump-menu__input" id="jumpMenu2" style="display:none;">
                    <span id="jumpEntry1Selection" class="action-tag"></span>
                    <input type="text" id="jumpEntry2" class="jump-to" placeholder="Search For..">
                </div>
                <div class="jump-menu__items" id="jumpMenuResults1"></div>
                <div class="jump-menu__items" id="jumpMenuResults2"></div>
                <div class="jump-menu__no-results" id="jumpMenuNoResults" style="display:none;"><div class="jump-menu__header text-center">No Results</div></div>

                <div class="jump-menu__footer">
                    <span class="jump-menu__shortcut"><?=lang('shortcut')?>: <span class="key">&#8984; J</span> <?=lang('or')?> <span class="key">Ctrl J</span></span>
                    <span class="jump-menu__close"><?=lang('close')?>: <span class="key">ESC</span></span>
                </div>
            </div>
        </div>

        <?=ee('CP/Alert')->getStandard()?>
        <script type="text/javascript" src="https://packettide.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-e6zu8v/b/23/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=3804d578"></script>

        <?php if (!isset($ee_cp_viewmode) || empty($ee_cp_viewmode)) : ?>
        <script type="text/javascript">
        $(document).ready(function(){
            $('#welcome-screen').show();

            $('.show-sidebar').on('click', function(){
                $('.ee-main--dashboard').css('background', 'var(--ee-dashboard-bg)');
                $('.ee-sidebar').removeClass('hidden');
                $('.main-nav').removeClass('hidden');
            });

            $('.main-nav__account').clone().css('display', 'none').appendTo('.dashboard');

            $('#jump-menu').on('modal:open', function () {
                $('.welcome-jump-instructions').fadeIn();
                $('.main-nav__account').fadeIn();
            }).on('modal:close', function () {
                $('.welcome-jump-instructions').fadeOut();
                $('.main-nav__account').fadeOut();
            });
        });
        </script>
        <?php endif; ?>

    </body>
</html>
