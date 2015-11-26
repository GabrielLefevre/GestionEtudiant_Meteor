/*
 ----------------------------------------------------------
 -----------------Template Etudiant------------------------
 ----------------------------------------------------------
 */
Template.etudiant.events({
    'submit form': function(e){
        /*
        Premiere version de l'ajout d'étudiant par formulaire, utilisé principaleemnt pour les test mais n'est plus présente dans la version finale
        du site.
         */
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
	/*
	Fonction de suppression d'un étudiant, supprimer un étudiant supprime également toute les notes et moyennes
	 */
	  'click .delete': function(e) {
    e.preventDefault();
	// Récupération de l'id de l'étudiant courant et suppression dans la BDD
    if (confirm("supprimer l'étudiant ?")) {
      var id_etu = this._id;
        var etudiantCourant = Etudiant.findOne({_id:id_etu}); // on recupere l'étudiant courant que l'on veut supprimer
        /*
        On va regarder combien de notes et moyennes à cet étudiants, les parcourir et les supprimer de la BDD avant
        de supprimer le document étudiant.
         */
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
/*
Fonction qui renvoi l'id de l'étudiant sur lequel on se trouve
 */
    getId: function() {
       var id_etu = Etudiant.findOne({_id:this._id})._id;
        var nb_sem="";
        var sem=[];
        return id_etu;
    },
/*
Fonction qui va generer le tableau HTML récapitulatif de l'étudiant avec ses notes, moyennes,
avis pour chaque semestre ou il est isncrit
 */
    infoSemestre :function() {
        var sem = Etudiant.findOne({_id:this._id}).semestre; // liste des semestre ou l'étudiant est inscris
        var etuCourant = Etudiant.findOne({_id:this._id}); // étudiant courant
        var info =""; // variable qui va contenir le code HTML du carnet
        /*
        On va parcourir chaque semestre ou l'étudiant est inscrit pour créer à chaque fois un tableau récapitulatif de ses résultats
         */
        for (var i=0; i<sem.length;i++) {
            var semCourant = sem[i]; // le nom du semestre
            var ue = Semestre.findOne({nom:semCourant}).UE; // la liste de ses UE
            var matiere =Matiere.findOne({semestre:semCourant}).matiere; // tableau des matieres
            var coeff = Matiere.findOne({semestre:semCourant}).coeff; // tableau des coeff
            var ueCourant =" ";
            var moySem = Moyenne.findOne({id_etu:etuCourant._id,UE:semCourant}).moyenne; // la moyenne actuelle du semestre
            var avis = Etudiant.findOne({_id:this._id}).avis; // le tableau des avis sur les semestre
            if (moySem == null){
                moySem = " ";
            }
            /*
            On ajoute a la variable info l'entête du tableau et la parti generale ou l'on retrouvera la moyenne genrale
            et l'avis sur son semestre decidé au moment du jury
             */
            info +="<div class=\"panel panel-primary filterable\"><div class=\"panel-heading\">";
            info += "<h3 class=\"panel-title\">"+semCourant+"</h3><p></p>";
            info +="<a class=\"btn btn-info\" onClick=\"colorier();\">Color</a></div>";
            info +="<table class=\"table\" id=\"table\"><tbody>";
            info+="<tr class=\"rowToClick2\"><td colspan=\"2\"><b><i>General</i></b></td></tr>"
            info +="<tr><td>Moyenne Generale</td><td>"+moySem+"</td></tr>";
            if(avis[i]) {
                info +="<tr><td>Decision du jury</td><td colspan=\"2\">"+avis[i]+"</td></tr>";
            }
            else {
                info +="<tr><td>Decision du jury</td><td colspan=\"2\">En attente de décision</td></tr>";
            }

           /*
           On va parcourir toute les notes du semestre et les UE auquels elles appartiennent pour afficher les resultats de l'étudiant
           sur son carnet
            */

            for ( var j = 0; j<matiere.length;j++) {
                var note = Note.findOne({matiere:matiere[j],id_etu:etuCourant._id}).note; // la note de la matiere actuelle
                var ueNote = Note.findOne({matiere:matiere[j],id_etu:etuCourant._id}).UE; // l'UE de la note actuelle
                /*
                Si il n'y a aucune note pour la matière on va afficher une chaine de caractère vide plutôt qu'un null
                 */
                if (note == null){
                    note = " ";
                }
                /*
                Si on arrive dans un nouvel UE, on va chercher ses informations et les afficher en entête de ses notes qui suivront
                 */
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
/*
 Fonction qui va generer le tableau HTML de poursuite d'étude de l'étudiant, les résultats affiché ici prennent en compte la totalité
 des semestre de l'étudiant. Les avis affichés sont calculés arbitrairement par rapport a des palliers
 LP : autorisé pour tous
 Licence : à partir de 11/20
 Ecole d'Ingénieur : au dessus de 14/20
 */
    poursuite: function() {
        var etuCourant = Etudiant.findOne({_id:this._id}); // étudiant courant
        var sem = Etudiant.findOne({_id:this._id}).semestre; // la liste des semestres ou l'étudiant est inscrit
        var info ="";
        var MoySemestre = 0;
        var nbr_moy = 0;
        var decision=true;
        /*
        On parcours les moyennes générale de chaque semestre de l'étudiant et on en fait une moyenne
        On vérifie avec un booléen que l'étudiant à au moins une note avant d'afficher les résultats
         */
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

        info += " <div class=\"panel panel-primary filterable\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Avis de poursuite d'étude</h3></div> <table class=\"table\"> <thead> <tr class=\"filters\"> ";

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
 ----------------------------------------------------------
 --------------Template events carnetEtu-------------------
 ----------------------------------------------------------

 Le script de couleur des notes est dans le fichier carnetEtu.html dans une balise <script>
 */

Template.carnetEtu.events({
    'submit form': function(e){
		e.preventDefault();
		
	}
});

/*

Ancienne version de l'affichage d'un carnet étudiant
(version moins ergonomique mais fonctionnelle)


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
 */