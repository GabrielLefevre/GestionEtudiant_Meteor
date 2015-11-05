Template.etudiant.events({
    'submit form': function(e){
		e.preventDefault();
		// Recuperation des valeurs mise dans le formulaire d'ajour d'étudiant
		var nom = $("input[name='nom']").val();
		var prenom = $("input[name='prenom']").val();
		var groupe = $("select[name='groupe']").val();
		var pro = $("select[name='promotion']").val();
		var mail = $("input[name='mail']").val();
		var adresse = $("input[name='adresse']").val();
		var cp = $("input[name='cp']").val();
		var ville = $("input[name='ville']").val();
		var sem = $("select[name='semestre']").val();
		var semestretmp = Semestre.findOne({nom: sem});
		// Création d'un objet avec les valeurs ci-dessus
		var etudiant = {
				nom: nom,
				prenom: prenom,
				mail: mail,
				groupe: groupe,
				promotion: pro,
				adresse: adresse,
				cp: cp,
				ville: ville,
				semestre:[sem]
		}

		var promo = {
			promotion:pro
		}
        // Ajout de l'étudiant a sa Collection
        Etudiant.insert(etudiant);
	},
	
	  'click .delete': function(e) {
    e.preventDefault();
	// Récupération de l'id de l'étudiant courant et suppression dans la BDD
    if (confirm("supprimer l'étudiant ?")) {
      var etudiantCourant = this._id;
      Etudiant.remove(etudiantCourant);
      Router.go('/etudiant')
    }
  }
});



Template.carnetEtu.events({
    'submit form': function(e){
		e.preventDefault();
		

		
	}
});