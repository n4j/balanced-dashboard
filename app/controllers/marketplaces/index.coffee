`import Ember from "ember";`
`import Auth from "balanced-dashboard/auth";`

MarketplacesIndexController = Balanced.ArrayController.extend
	testMarketplaces: Ember.computed.filterBy("auth.user.user_marketplaces", "production", false)
	productionMarketplaces: [] # Ember.computed.filterBy("auth.user.user_marketplaces", "production", true)

	actions:
		goToMarketplace: (marketplace) ->
			@transitionTo('marketplace', marketplace)

`export default MarketplacesIndexController;`