import MemberGroups from '../../elements/pages/members/MemberGroups';
import MemberCreate from '../../elements/pages/members/MemberCreate';
const page = new MemberGroups;
const member = new MemberCreate;


context('Test Member roles Addons ', () => {

	before(function(){
		cy.task('db:seed')
		cy.addRole('AddonManager')
		cy.addMembers('AddonManager', 1)
		cy.logout();
	})

	it('Addon Manager can not login because cp access has not been given yet',() => {
		cy.auth({
			email: 'AddonManager1',
			password: 'password'
		})
		cy.hasNoErrors()
	   cy.get('p').contains('You are not authorized to perform this action')
	 })

	it('Let Addon Role access Addons and CP', () => {
		cy.auth()

		cy.hasNoErrors()


	   cy.visit('admin.php?/cp/members/roles')

	   cy.get('div[class="list-item__title"]').contains('AddonManager').click()

	   cy.get('button').contains('CP Access').click()
	   cy.get('#fieldset-can_access_cp .toggle-btn').click(); //access CP


		cy.get('#fieldset-can_access_addons .toggle-btn').click();
		cy.get('#fieldset-can_admin_addons .toggle-btn').click();
		cy.get('#fieldset-addons_access .checkbox-label:nth-child(1) > input').click();
		cy.get('#fieldset-addons_access .checkbox-label:nth-child(2) > input').click();
		cy.get('#fieldset-addons_access .checkbox-label:nth-child(3) > input').click();
		cy.get('#fieldset-addons_access .checkbox-label:nth-child(4) > input').click();
		cy.get('#fieldset-addons_access .checkbox-label:nth-child(5) > input').click();
		cy.get('#fieldset-addons_access .checkbox-label:nth-child(6) > input').click();
		cy.get('#fieldset-rte_toolsets .checkbox-label:nth-child(1) > input').click();
		cy.get('#fieldset-rte_toolsets .checkbox-label:nth-child(2) > input').click();
		cy.get('#fieldset-rte_toolsets .checkbox-label:nth-child(3) > input').click(); //lets them do anything with addons



		cy.get('button').contains('save').eq(0).click()
	})

	it('Can see the Addons now but nothing else',() => {
		cy.auth({
			email: 'AddonManager1',
			password: 'password'
		})

		cy.hasNoErrors()

		cy.visit('admin.php?/cp/members/profile/settings')
		cy.get('h1').contains('AddonManager1')
		cy.get('.main-nav__account-icon > img').click()
		//


		cy.get('.ee-sidebar').contains('Add-Ons').should('exist')

	   cy.get('.ee-sidebar').should('not.contain','Categories')
	   cy.get('.ee-sidebar').should('not.contain', 'Entries')

	   cy.get('.ee-sidebar').should('not.contain','Files')
	   cy.get('.ee-sidebar').should('not.contain','Members')

	})

	it('Can Access all Addons and has the option to Uninstall them',() => {
		cy.auth({
			email: 'AddonManager1',
			password: 'password'
		})

		cy.hasNoErrors()


		cy.visit('admin.php?/cp/members/profile/settings')

	   cy.get('h1').contains('AddonManager1')
	   cy.get('.main-nav__account-icon > img').click()
	   //

	   cy.get('.ee-sidebar').contains('Add-Ons').click()

	   cy.contains('Email')
	   cy.contains('Rich Text Editor')
	   cy.contains('Statistics')


	   cy.get(':nth-child(1) > .add-on-card__cog > .fas').click()
	   cy.get('a').contains('Uninstall')

	   cy.get('.main-nav__title > h1').click()

	   cy.get(':nth-child(2) > .add-on-card__cog > .fas').click()
	   cy.get('a').contains('Uninstall')

	   cy.get('.main-nav__title > h1').click()

	   cy.get(':nth-child(3) > .add-on-card__cog > .fas').click()
	   cy.get('a').contains('Uninstall')

	})

	it.skip('Cleans for reruns', () =>{
		cy.visit('admin.php?/cp/login');
	   cy.get('#username').type('admin');
	   cy.get('#password').type('password');
	   cy.get('.button').click();

	   cy.visit('admin.php?/cp/members/roles')

	   cy.get('.list-item:nth-child(1) input').click();


	   cy.get('select').select('Delete')
    	cy.get('.bulk-action-bar > .button').click()
    	cy.get('.modal-confirm-delete > .modal > form > .dialog__actions > .dialog__buttons > .button-group > .btn').click()
    	cy.visit('admin.php?/cp/members')


	    cy.get('tr:nth-child(1) > td > input').click();

	    cy.get('select').select('Delete');

	    cy.get('.button--primary').click();

	    cy.get("body").then($body => {
	          if ($body.find("#fieldset-verify_password > .field-control > input").length > 0) {   //evaluates as true if verify is needed
	              cy.get("#fieldset-verify_password > .field-control > input").type('password');
	          }
	    });
	    //Sometimes it asks for password to delete users and sometimes it does not.

	    cy.get('.button--danger').click();
	    cy.get('.modal-confirm-delete form').submit();
	})


}) //End Context
