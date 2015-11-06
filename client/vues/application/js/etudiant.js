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
/*
----------------------------------------------------------
-----------------Template carnetEtu-----------------------
----------------------------------------------------------
 */
Template.carnetEtu.helpers({

    getId: function() {
       var id_etu = Etudiant.findOne({_id:this._id})._id;
        var nb_sem="";
        var sem=[];
        return id_etu;
    },

	infoSemestre :function() {
        var sem = Etudiant.findOne({_id:this._id}).semestre;
        for (var i=0; i<sem.length;i++) {
            var semCourant = sem[i]; // le nom du semestre
            var ue = UE.find({semestre:semCourant}); // la liste de ses UE
            var matiere =Matiere.findOne({semestre:semCourant}).matiere; // tableau des matieres
            alert(semCourant + " " + matiere );


        }
        //return tab_html;
    },

});

/*
 ----------------------------------------------------------
 --------------Template events carnetEtu-------------------
 ----------------------------------------------------------
 */

/*
 TODO-LIST
 Faire redoubler un Etudiant
 Mettre la couleur sur les moyennes
 Faire passer l'étudiant au semestre suivant
 */

Template.carnetEtu.events({
    'submit form': function(e){
		e.preventDefault();

		
	}
});