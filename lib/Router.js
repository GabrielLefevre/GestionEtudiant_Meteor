Router.configure({
	layoutTemplate: 'mainLayout',
	notFoundTemplate: 'notFound'
});

Router.route('/', {
    name: 'index'
});

Router.route('/etudiant', {
	name: 'etudiant',
	data: function(){
		var etudiant = Etudiant.find();
		var semestre = Semestre.find();
		var promo = Promotion.find();
		return {
			etudiant: etudiant,
			semestre: semestre,
			promo:promo
		};
	},
	waitOn: function(){
		return Meteor.subscribe("allEtudiantsHeaders");
	}
});

Router.route('/promotion', {
	name: 'promotion',
	data: function(){
		var promotion = Promotion.find();
		
		return {
			promotion:promotion
		};
	}
});

Router.route('/promotion/:promotion', {
    name: "carnetPromo",
	data: function(){
		var etudiant = Etudiant.find();
		return {
			etudiant:etudiant
		}
	}
});

Router.route('/note',{
	name:"note",
	data: function() {
		var etudiant=Etudiant.find();
		return {
			etudiant:etudiant
		}
	}
});

Router.route('etudiant/:_id', {
	name: 'carnetEtu',
	data: function() {
		return Etudiant.findOne({_id: this.params._id});
	}
});

Router.route('/semestre', {
	name: 'semestre',
	data: function(){
		var semestre = Semestre.find();
		var ue = Semestre.find();
		
		return {
			semestre: semestre,
			ue:ue
		};
	}
});

Router.route('/inscription', {
	name: 'inscription',
	data: function(){
		var semestre = Semestre.find();
		return {
			semestre: semestre
		};
	}
});
