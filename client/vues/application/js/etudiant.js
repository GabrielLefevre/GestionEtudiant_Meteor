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
		};

		var promo = {
			promotion:pro
		};
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
        var etuCourant = Etudiant.findOne({_id:this._id});
        for (var i=0; i<sem.length;i++) {
            var semCourant = sem[i]; // le nom du semestre
            var ue = Semestre.findOne({nom:semCourant}).UE; // la liste de ses UE
            var matiere =Matiere.findOne({semestre:semCourant}).matiere; // tableau des matieres
            var coeff = Matiere.findOne({semestre:semCourant}).coeff; // tableau des coeff
            var ueCourant =Note.findOne({matiere:matiere[0],nom:etuCourant.nom,prenom:etuCourant.prenom,promo:etuCourant.promotion}).UE;
            var sommeMoyMatiere = 0;
            var sommeCoeffMatiere = 0;
            var info =" <div class=\"panel panel-primary filterable\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">"+semCourant+"</h3></div>"
            info +="<table class=\"table\"> <thead> <tr class=\"filters\"> <th><input type=\"text\" class=\"form-control\" placeholder=\"Matiere\" disabled></th><th><input type=\"text\" class=\"form-control\" placeholder=\"Coeff\" disabled></th><th><input type=\"text\" class=\"form-control\" placeholder=\"Moyenne\" disabled></th> </tr> </thead> <tbody>";
            for ( var j = 0; j<=matiere.length;j++) {
                if(j==matiere.length) {
                    var moyUE = sommeMoyMatiere/sommeCoeffMatiere;
                    var coeffUE = UE.findOne({nom:ueCourant}).coeff;
                    info+="<tr><td name=\"matiere\"><b>"+ueCourant+"</b></td><td name=\"coeff\"><b>"+coeffUE+"</b></td><td name=\"note\"><b>"+moyUE.toFixed(2)+"</b></td></tr>";
                }
                else {
                    var note = Note.findOne({matiere:matiere[j],nom:etuCourant.nom,prenom:etuCourant.prenom,promo:etuCourant.promotion}).note;
                    var ueNote = Note.findOne({matiere:matiere[j],nom:etuCourant.nom,prenom:etuCourant.prenom,promo:etuCourant.promotion}).UE;

                    if(ueNote != ueCourant) {
                        var moyUE = sommeMoyMatiere/sommeCoeffMatiere;
                        var coeffUE = UE.findOne({nom:ueCourant}).coeff;
                        info+="<tr><td name=\"matiere\"><b>"+ueCourant+"</b></td><td name=\"coeff\"><b>"+coeffUE+"</b></td><td name=\"note\"><b>"+moyUE.toFixed(2)+"</b></td></tr>";
                        ueCourant = ueNote;
                        sommeMoyMatiere =0;
                        sommeCoeffMatiere = 0;
                        info+="<tr><td name=\"matiere\">"+matiere[j]+"</td><td name=\"coeff\">"+coeff[j]+"</td><td name=\"note\">"+note+"</td></tr>";
                        sommeCoeffMatiere += parseFloat(coeff[j]);
                        sommeMoyMatiere+= (parseFloat(note)*parseFloat(coeff[j]));
                    }// if

                    else {
                        info+="<tr><td name=\"matiere\">"+matiere[j]+"</td><td name=\"coeff\">"+coeff[j]+"</td><td name=\"note\">"+note+"</td></tr>";
                        sommeCoeffMatiere += parseFloat(coeff[j]);
                        sommeMoyMatiere += (parseFloat(note)*parseFloat(coeff[j]));
                    }
                } // else



            } // for matiere
            var endInfo ="</tbody></table></div>"
            info += endInfo;
        } // for semestre
        return info;
    },
    /*
     var test = "coucou";
     test += semCourant;
     return "<p>ceci est un test "+test+" erere </p>"; // affiche ceci est un test coucouS1 erere
     */

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