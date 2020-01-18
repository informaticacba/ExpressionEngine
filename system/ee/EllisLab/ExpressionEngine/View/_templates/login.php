<!doctype html>
<html>
	<head>
		<?=ee()->view->head_title($cp_page_title)?>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" lang="en-us" dir="ltr">
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"  name="viewport">
		<?=ee()->view->head_link('css/common.min.css'); ?>
	</head>
	<body>
		<section class="login-container">
			<section class="login">

				<?=$child_view?>

			</section>
		</section>
		<?=ee()->view->script_tag('jquery/jquery.js')?>
		<?=ee()->view->script_tag('common.min.js')?>
		<?=ee()->view->script_tag('vendor/focus-visible.js')?>
		<?=ee()->view->script_tag('cp/login.js')?>
		<script type="text/javascript">
			$(document).ready(function()
			{
				document.getElementById('<?=$focus_field?>').focus();
			});
		</script>
	</body>
</html>
