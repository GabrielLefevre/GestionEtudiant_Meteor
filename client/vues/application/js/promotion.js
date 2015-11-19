/**
 * Created by Gabriel on 18/11/2015.
 */

/*
 ----------------------------------------------------------
 -----------------Template carnetPromo---------------------
 ----------------------------------------------------------
 */
Template.carnetPromo.helpers({


    infoSemestre: function () {
        var promoCourante = Promotion.findOne({promotion: this.promotion});

        // On commence par parcourir la Collection Semestre et on stocke dans un tableau tout les noms des semestres existant
        var sem = Semestre.find();
        var tabSem = [];
        Semestre.find().forEach(function (sem) {
            tabSem.push(sem.nom);
        });

        var tabHtml = "";
        for (var i = 0; i < tabSem.length; i++) {
            var listeUE = Semestre.findOne({nom: tabSem[i]}).UE; // LA liste des UE du semestre
            var listeMatiere = Matiere.findOne({semestre:tabSem[i]}).matiere; // La liste des matieres du semestre
            var listeCoeff = Matiere.findOne({semestre:tabSem[i]}).coeff; // tableau des coeff
            var ue = 0; // indice de l'UE courant

            if (Note.find({UE: listeUE[0], promo: promoCourante.promotion}).count() > 0) {
                tabHtml += " <div class=\"panel panel-primary filterable\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">" + tabSem[i] + "</h3></div> <table class=\"table\"> <thead> <tr class=\"filters\"> ";

                tabHtml += "<th><input type=\"text\" class=\"form-control\" placeholder=\"Matiere\" disabled></th>";
                tabHtml += "<th><input type=\"text\" class=\"form-control\" placeholder=\"Moyenne générale\" disabled></th>";
                tabHtml += "<th><input type=\"text\" class=\"form-control\" placeholder=\"Moyenne la plus haute\" disabled></th>";
                tabHtml += "<th><input type=\"text\" class=\"form-control\" placeholder=\"Moyenne la plus basse\" disabled></th> </tr> </thead> <tbody>";

                for ( var j = 0; j<=listeMatiere.length;j++) {
                    var moyenne = 0;
                    if ( j== listeMatiere.length){

                    }
                    else {
                        var ueNote = Note.findOne({matiere:listeMatiere[j],promo:promoCourante.promotion}).UE;
                        if(ueNote!=listeUE[ue]) {

                            var moyenneUE = 0;
                            var listeMoyUE = Moyenne.find({UE:listeUE[ue]});
                            var tabMoyUE = [];
                            Moyenne.find({UE:listeUE[ue]}).forEach(function (listeMoyUE) {
                                tabMoyUE.push(listeMoyUE.note);
                            });
                            for(var k=0; k<tabMoyUE.length; k++) {
                                moyenneUE += tabMoyUE[k];
                            }
                            moyenneUE = moyenneUE/tabMoyUE.length;
                            tabHtml+="<tr><td name=\"matiere\"><b>"+listeUE[ue]+"</b></td><td name=\"Moyenne\">"+moyenneUE+"</td><td name=\"moyBasse\">a venir</td><td name=\"moyHaute\">a venir</td></tr>";
                            ue++;


                            var listeMoy = Note.find({UE:listeUE[ue],matiere:listeMatiere[j]});
                            var tabMoy = [];
                            Note.find({UE:listeUE[ue],matiere:listeMatiere[j]}).forEach(function (listeMoy) {
                                tabMoy.push(listeMoy.note);
                            });
                            for(var k=0; k<tabMoy.length; k++) {
                                moyenne += tabMoy[k];
                            }
                            moyenne = moyenne/tabMoy.length;
                            tabHtml+="<tr><td name=\"matiere\">"+listeMatiere[j]+"</td><td name=\"Moyenne\">"+moyenne+"</td><td name=\"moyBasse\">a venir</td><td name=\"moyHaute\">a venir</td></tr>";
                        }

                        else {
                            var listeMoy = Note.find({UE:listeUE[ue],matiere:listeMatiere[j]});
                            var tabMoy = [];
                            Note.find({UE:listeUE[ue],matiere:listeMatiere[j]}).forEach(function (listeMoy) {
                                tabMoy.push(listeMoy.note);
                            });
                            for(var k=0; k<tabMoy.length; k++) {
                                moyenne += tabMoy[k];
                            }
                            moyenne = moyenne/tabMoy.length;
                            tabHtml+="<tr><td name=\"matiere\">"+listeMatiere[j]+"</td><td name=\"Moyenne\">"+moyenne+"</td><td name=\"moyBasse\">a venir</td><td name=\"moyHaute\">a venir</td></tr>";

                        }





                    }







                } // for matiere
                tabHtml += "</tbody></table></div>";
            } // if
        } // for i

        return tabHtml;
    } // inforSemestre


});

/*
 ----------------------------------------------------------
 --------------Template events carnetPromo-----------------
 ----------------------------------------------------------
 */

/*
 TODO-LIST
 Faire redoubler un Etudiant
 Faire passer l'étudiant au semestre suivant
 */

Template.carnetPromo.events({
    'click .add': function (e) {
        e.preventDefault();
        // On recupère le contenu du textarea
        var textarea = $("textarea[id='textarea']").val();
        // On compte le nombre de ligne du textarea
        var nbr_ligne = 1;
        var nbr_char_ligne = 0;
        var nbr_char_on_ligne = 180;
        for (var i = 0; i < textarea.length; i++) {
            if (textarea.charCodeAt(i) == 10) {
                nbr_ligne++;
                nbr_char_ligne = 0;
            } else {
                nbr_char_ligne++;
                if (nbr_char_ligne > nbr_char_on_ligne) {
                    nbr_ligne++;
                    nbr_char_ligne = 1;
                } // if
            } // else
        } // for
        var promo = Promotion.findOne({promotion: this.promotion}).promotion;
        // On rentre les lignes du textarea dans un tableau temporaire
        if (confirm("Inscrire les " + nbr_ligne + " étudiants au prochain semestre ? ")) {
            var nbr_colonne = 3;
            var j = 0;
            var data = textarea.split(/[;,\n]+/);
            var etu = [];


            for (var i = 0; i < nbr_ligne; i++) {
                for (var k = 0; k < nbr_colonne; k++) {
                    etu[k] = data[j];
                    j++;
                }
                alert(etu[0] + " " + etu[1] + " "+ etu[2] + " "+ promo);
                var idEtu = Etudiant.findOne({nom: etu[0], prenom: etu[1], promotion: promo})._id;
                Etudiant.update({_id: idEtu}, {$push: {semestre: etu[2]}});


                var UEsem = Semestre.findOne({nom: etu[2]}).UE;
                for (var k = 0; k < UEsem.length; k++) {
                    var moy = {
                        id_etu: idEtu,
                        UE: UEsem[k],
                        moyenne: null
                    }
                    Moyenne.insert(moy);
                    var matiere = UE.findOne({nom: UEsem[k]}).matiere; // tableau des matieres
                    for (var l = 0; l < matiere.length; l++) {
                        var note = {
                            nom: etu[0],
                            prenom: etu[1],
                            promo: promo,
                            id_etu: idEtu,
                            UE: UEsem[k],
                            matiere: matiere[l],
                            note: null
                        }
                        Note.insert(note);
                    }
                } //for k
                var moySem = {
                    id_etu: idEtu,
                    UE: etu[2],
                    moyenne: null
                }
                Moyenne.insert(moySem);

            } // for i

        } // if confirm


    }
});


//var tmp = Etudiant.find({promotion:"2015-2016"},{sort:{semestre:-1}},{limit:(1)});