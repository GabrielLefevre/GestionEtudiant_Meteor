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
        var UEsem = Semestre.findOne({nom:sem}).UE;
        var id = Etudiant.findOne({nom:nom,prenom:prenom,groupe:groupe,promotion:pro})._id;
        alert(id);
        for (var i =0; i<UEsem.length;i++){
            var moy = {
                id_etu : id,
                UE:UEsem[i],
                moyenne:null
            }
            Moyenne.insert(moy);
        }

	},
	
	  'click .delete': function(e) {
    e.preventDefault();
	// Récupération de l'id de l'étudiant courant et suppression dans la BDD
    if (confirm("supprimer l'étudiant ?")) {
      var id_etu = this._id;
        var etudiantCourant = Etudiant.findOne({_id:id_etu});
        var nbr_note = Note.find({id_etu:id_etu}).count();
        var nbr_moy = Moyenne.find({id_etu:id_etu}).count();
        for (var i = 0;i<nbr_note;i++) {
            var id_note = Note.findOne({id_etu:id_etu})._id;
            Note.remove({_id:id_note});
        }
        for (var i = 0;i<nbr_moy;i++) {
            var id_moy = Moyenne.findOne({id_etu:id_etu})._id;
            Moyenne.remove({_id:id_moy});
        }
        Etudiant.remove({_id:id_etu});
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
        var info ="";
        for (var i=0; i<sem.length;i++) {
            var semCourant = sem[i]; // le nom du semestre
            var ue = Semestre.findOne({nom:semCourant}).UE; // la liste de ses UE
            var matiere =Matiere.findOne({semestre:semCourant}).matiere; // tableau des matieres
            var coeff = Matiere.findOne({semestre:semCourant}).coeff; // tableau des coeff
            var ueCourant =Note.findOne({matiere:matiere[0],nom:etuCourant.nom,prenom:etuCourant.prenom,promo:etuCourant.promotion}).UE;


             info +=" <div class=\"panel panel-primary filterable\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">"+semCourant+"</h3></div>"
            info +="<table class=\"table\"> <thead> <tr class=\"filters\"> <th><input type=\"text\" class=\"form-control\" placeholder=\"Matiere\" disabled></th><th><input type=\"text\" class=\"form-control\" placeholder=\"Coeff\" disabled></th><th><input type=\"text\" class=\"form-control\" placeholder=\"Moyenne\" disabled></th> </tr> </thead> <tbody>";
            for ( var j = 0; j<=matiere.length;j++) {
                if(j==matiere.length) {
                    var moyUE = Moyenne.findOne({id_etu:etuCourant._id,UE:ueCourant}).moyenne;
                    var coeffUE = UE.findOne({nom:ueCourant}).coeff;
                    info+="<tr><td name=\"matiere\"><b>"+ueCourant+"</b></td><td name=\"coeff\"><b>"+coeffUE+"</b></td><td name=\"note\"><b>"+moyUE+"</b></td></tr>";
                }
                else {
                    var note = Note.findOne({matiere:matiere[j],nom:etuCourant.nom,prenom:etuCourant.prenom,promo:etuCourant.promotion}).note;
                    var ueNote = Note.findOne({matiere:matiere[j],nom:etuCourant.nom,prenom:etuCourant.prenom,promo:etuCourant.promotion}).UE;
                    if(ueNote != ueCourant) {
                        var moyUE = Moyenne.findOne({id_etu:etuCourant._id,UE:ueCourant}).moyenne;
                        var coeffUE = UE.findOne({nom:ueCourant}).coeff;
                        info+="<tr><td name=\"matiere\"><b>"+ueCourant+"</b></td><td name=\"coeff\"><b>"+coeffUE+"</b></td><td name=\"note\"><b>"+moyUE+"</b></td></tr>";
                        ueCourant = ueNote;
                        info+="<tr><td name=\"matiere\">"+matiere[j]+"</td><td name=\"coeff\">"+coeff[j]+"</td><td name=\"note\">"+note+"</td></tr>";
                    }// if
                    else {
                        info+="<tr><td name=\"matiere\">"+matiere[j]+"</td><td name=\"coeff\">"+coeff[j]+"</td><td name=\"note\">"+note+"</td></tr>";
                    }
                } // else
            } // for matiere
            var moySem = Moyenne.findOne({id_etu:etuCourant._id,UE:semCourant}).moyenne;
            info += "<tr><td name=\"matiere\"><b>Moyenne générale du semestre : </b></td><td name=\"note\"><b>"+moySem+"</b></td></tr>";
            var endInfo ="</tbody></table></div>"
            info += endInfo;
        } // for semestre
        return info;
    },

    infoSemestre2 :function() {
        var sem = Etudiant.findOne({_id:this._id}).semestre;
        var etuCourant = Etudiant.findOne({_id:this._id});
        var info ="";
        for (var i=0; i<sem.length;i++) {
            var semCourant = sem[i]; // le nom du semestre
            var ue = Semestre.findOne({nom:semCourant}).UE; // la liste de ses UE
            var matiere =Matiere.findOne({semestre:semCourant}).matiere; // tableau des matieres
            var coeff = Matiere.findOne({semestre:semCourant}).coeff; // tableau des coeff
            var ueCourant =" ";
            var moySem = Moyenne.findOne({id_etu:etuCourant._id,UE:semCourant}).moyenne;
            if (moySem == null){
                moySem = " ";
            }
            info +="<div class=\"panel panel-primary filterable\"><div class=\"panel-heading\">";
            info += "<h3 class=\"panel-title\">"+semCourant+"</h3><p></p>";
            info +="<a class=\"btn btn-info\" onClick=\"colorTest();\">Color</a></div>";
            info +="<table class=\"table\" id=\"table"+i+"\"><tbody>";
            info+="<tr class=\"rowToClick2\"><td colspan=\"2\"><b><i>General</i></b></td></tr>"
            info +="<tr><td>Moyenne Generale</td><td>"+moySem+"</td></tr>";
            info +="<tr><td>Decision du jury</td><td colspan=\"2\">a venir</td></tr>";
            info+="<tr><td>Nombre d'absences</td><td colspan=\"2\">a venir</td></tr>";

            for ( var j = 0; j<matiere.length;j++) {
                var note = Note.findOne({matiere:matiere[j],id_etu:etuCourant._id}).note;
                var ueNote = Note.findOne({matiere:matiere[j],id_etu:etuCourant._id}).UE;
                if (note == null){
                    note = " ";
                }
                if(ueNote != ueCourant) {
                    ueCourant = ueNote;
                    var moyUe = Moyenne.findOne({UE:ueCourant,id_etu:etuCourant._id}).moyenne;
                    if (moyUe == null){
                        moyUe = " ";
                    }
                    info +="<tr class=\"rowToClick2\"><td colspan=\"2\"><b><i>"+ueCourant +" : " +moyUe+"</i></b></td></tr>";
                    info+="<tr><td>"+matiere[j]+"</td><td colspan=\"2\">"+note+"</td></tr>";
                }
                else {
                    info+="<tr><td>"+matiere[j]+"</td><td colspan=\"2\">"+note+"</td></tr>";
                } // else
            } // for matiere
            info += "</tbody></table></div>";
        } // for i
        return info;
    }, // infoS

    poursuite: function() {
        var etuCourant = Etudiant.findOne({_id:this._id});
        var sem = Etudiant.findOne({_id:this._id}).semestre;
        var info ="";
        var MoySemestre = 0;
        var nbr_moy = 0;
        var decision=true;
        for (var i = 0;i<sem.length;i++) {
            if (Moyenne.findOne({UE:sem[i],id_etu:etuCourant._id}).moyenne != null) {
                MoySemestre+=Moyenne.findOne({UE:sem[i],id_etu:etuCourant._id}).moyenne;
                nbr_moy++;
            }
        }
        if(nbr_moy==0) {
            decision=false;
        }
        if(decision) {
            var moyenne = MoySemestre/nbr_moy;
        }

        info += " <div class=\"panel panel-primary filterable\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Avis poursuite d'étude</h3></div> <table class=\"table\"> <thead> <tr class=\"filters\"> ";

        info += "<th><input type=\"text\" class=\"form-control\" placeholder=\"Poursuite\" disabled></th>";
        info += "<th><input type=\"text\" class=\"form-control\" placeholder=\"Favorable\" disabled></th>";
        info += "<th><input type=\"text\" class=\"form-control\" placeholder=\"Défavorable\" disabled></th> </tr> </thead> <tbody>";
        info +="<tr> <td> Licence Pro </td> <td>X</td> <td></td></tr>";
        if(moyenne >11) {
            info +="<tr> <td> Licence </td> <td>X</td> <td></td></tr>";
        }
        else {
            info +="<tr> <td> License </td> <td></td> <td>X</td></tr>";
        }
        if(moyenne >14) {
            info +="<tr> <td> Ecole d'Ingénieur </td> <td>X</td> <td></td></tr>";
        }
        else {
            info +="<tr> <td> Ecole d'Ingénieur </td> <td></td> <td>X</td></tr>";
        }
        info+="</tfoot></table></div>";
        return info;
    }




});
/*

 */






/*
 ----------------------------------------------------------
 --------------Template events carnetEtu-------------------
 ----------------------------------------------------------
 */

Template.carnetEtu.events({
    'submit form': function(e){
		e.preventDefault();

            alert(sem);
		
	}
});