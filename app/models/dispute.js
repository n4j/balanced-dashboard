Balanced.Dispute = Balanced.Model.extend(Ember.Validations, {
	transaction: Balanced.Model.belongsTo('transaction', 'Balanced.Transaction'),
	events: Balanced.Model.hasMany('events', 'Balanced.Event'),
	documents: Balanced.Model.hasMany('dispute_documents', 'Balanced.DisputeDocument'),

	state: function() {
		var status = this.get('status');
		if (status === 'pending' && this.get('documents.length')) {
			return 'submitted';
		}
		return status;
	}.property('documents.length', 'status'),

	note: null,
	tracking_number: null,
	validations: {
		note: {
			presence: true
		}
	},
	justitia_dispute: function() {
		return Balanced.JustitiaDispute.find(this.get('dispute_uri'));
	}.property('dispute_uri'),

	isEvidenceProvided: function() {
		return !!this.get('justitia_dispute.created_at');
	}.property('justitia_dispute.created_at'),

	type_name: 'Dispute',
	route_name: 'dispute',

	uri: '/disputes',
	events_uri: Balanced.computed.concat('uri', '/events'),

	dispute_uri: function() {
		return '/disputes/' + this.get('id');
	}.property('id'),

	dispute_documents_uri: function() {
		return '/disputes/' + this.get('id') + '/documents';
	}.property('id'),

	amount_dollars: function() {
		if (this.get('amount')) {
			return (this.get('amount') / 100).toFixed(2);
		} else {
			return '';
		}
	}.property('amount'),

	customer_display_me: Ember.computed.alias('transaction.customer.display_me'),
	customer_email: Ember.computed.alias('transaction.customer.email'),

	last_four: Ember.computed.alias('transaction.last_four'),
	bank_name: Ember.computed.alias('transaction.bank_name'),
	funding_instrument_description: Ember.computed.oneWay('transaction.funding_instrument_description').readOnly(),
	funding_instrument_name: Ember.computed.alias('transaction.funding_instrument_name'),
	funding_instrument_type: Ember.computed.alias('transaction.funding_instrument_type'),
	page_title: Balanced.computed.orProperties('transaction.description', 'transaction.id'),

	getTransactionsLoader: function(attributes) {
		attributes = _.extend({
			dispute: this
		}, attributes);

		return Balanced.DisputeTransactionsResultsLoader.create(attributes);
	},

	hasExpired: function() {
		return moment(this.get('respond_by')).toDate() < moment().toDate();
	}.property('respond_by'),

	canUploadDocuments: function() {
		return !this.get('isEvidenceProvided') && !this.get('hasExpired') && (this.get('status') === 'pending');
	}.property('isEvidenceProvided', 'hasExpired', 'status')
});

Balanced.TypeMappings.addTypeMapping('dispute', 'Balanced.Dispute');
