/**
 * Created by Gabriel on 18/11/2015.
 */

/*
 ----------------------------------------------------------
 -----------------Template carnetPromo---------------------
 ----------------------------------------------------------
 */
Template.carnetPromo.helpers({

    /*
     var tmp = Etudiant.find({promotion:"2015-2016"},{sort:{semestre:-1}},{limit:(1)});
     var tmp2 = Etudiant.find({promotion:"2015-2016"}).sort({semestre:-1}).limit(1);
     */


    infoSemestre: function () {
        function compare(x, y) {
            return x - y;
        }
        function compareInverse(x, y) {
            return y - x;
        }

        var promoCourante = Promotion.findOne({_id:this._id});

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
            var ueCourant = " "; // l'UE courant
            var moyGen = 0;
            if (Note.find({UE: listeUE[0], promo: promoCourante.promotion}).count() > 0) {

                var listeMoyGen = Moyenne.find({UE:tabSem[i],promo:promoCourante.promotion});
                var tabMoyGen =[];
                Moyenne.find({UE:tabSem[i],promotion:promoCourante.promotion}).forEach(function (listeMoyGen) {
                    if(listeMoyGen.moyenne != null) {
                        tabMoyGen.push(listeMoyGen.moyenne);
                    }

                });
                if(tabMoyGen.length>0){
                    for(var k =0;k<tabMoyGen.length;k++) {
                        moyGen+=tabMoyGen[k];
                    }
                    moyGen = moyGen/tabMoyGen.length;
                    moyGen = Math.round(moyGen*100)/100;
                }
                tabMoyGen.sort(compare);
                var minGen = tabMoyGen[0];
                var maxGen = tabMoyGen[tabMoyGen.length-1];


                tabHtml +="<div class=\"panel panel-primary filterable\"><div class=\"panel-heading\">";
                tabHtml += "<h3 class=\"panel-title\">"+tabSem[i]+"</h3><p></p>";
                tabHtml +="<a class=\"btn btn-info\" onClick=\"colorTest();\">Color</a></div>";
                tabHtml +="<table class=\"table\" id=\"table"+i+"\"><tbody>";
                tabHtml+="<tr class=\"rowToClick2\"><td colspan=\"6\"><b><i>General</i></b></td></tr>";
                tabHtml+="<tr style=\"background-color:#CCCCFF\"><td></td><td colspan=\"2\">Moyenne la plus basse</td><td colspan=\"2\">Moyenne Generale</td><td colspan=\"2\">Moyenne la plus haute</td></tr>";
                tabHtml +="<tr><td>Moyenne generale</td><td colspan=\"2\">"+minGen+"</td><td colspan=\"2\">"+moyGen+"</td><td colspan=\"2\">"+maxGen+"</td></tr>";
                for ( var j = 0; j<listeMatiere.length;j++) {
                    var ueNote = Note.findOne({matiere:listeMatiere[j],promo:promoCourante.promotion}).UE;
                    var moyMat = 0;
                    var moyUE = 0;

                    if(ueNote != ueCourant) {
                        ueCourant = ueNote;
                        var listeMoyUE = Moyenne.find({UE:ueCourant,promo:promoCourante.promotion});
                        var tabMoyUE =[];
                        Moyenne.find({UE:ueCourant,promotion:promoCourante.promotion}).forEach(function (listeMoyUE) {
                            if(listeMoyUE.moyenne != null) {
                                tabMoyUE.push(listeMoyUE.moyenne);
                            }

                        });
                        if(tabMoyUE.length>0){
                            for(var k =0;k<tabMoyUE.length;k++) {
                                moyUE+=tabMoyUE[k];
                            }
                            moyUE = moyUE/tabMoyUE.length;
                            moyUE = Math.round(moyUE*100)/100;
                        }


                        var listeMoy = Note.find({UE:ueCourant,matiere:listeMatiere[j]});
                        var tabMoy = [];
                        Note.find({UE:ueCourant,matiere:listeMatiere[j],promo:promoCourante.promotion}).forEach(function (listeMoy) {
                            if(listeMoy.note != null) {
                                tabMoy.push(listeMoy.note);
                            }

                        });
                        if(tabMoy.length>0){
                            for(var k =0;k<tabMoy.length;k++) {
                                moyMat+=tabMoy[k];
                            }
                            moyMat = moyMat/tabMoy.length;
                            moyMat = Math.round(moyMat*100)/100;
                        }
                        tabMoy.sort(compare);
                        var min = tabMoy[0];
                        var max = tabMoy[tabMoy.length-1];
                        if (moyMat==0) {
                            tabHtml += "<tr class=\"rowToClick2\"><td colspan=\"6\"><b><i>"+ueCourant +" : </i></b></td></tr>";
                            tabHtml+="<tr style=\"background-color:#CCCCFF\"><td>Matiere</td><td colspan=\"2\">Moyenne la plus basse</td><td colspan=\"2\">Moyenne Generale</td><td colspan=\"2\">Moyenne la plus haute</td></tr>";
                            tabHtml +="<tr><td>"+listeMatiere[j]+"</td><td colspan=\"2\"></td><td colspan=\"2\"></td><td colspan=\"2\"></td></tr>";
                        }
                        else {
                            tabHtml += "<tr class=\"rowToClick2\"><td colspan=\"6\"><b><i>"+ueCourant +" : "+ moyUE+"</i></b></td></tr>";
                            tabHtml+="<tr style=\"background-color:#CCCCFF\"><td>Matiere</td><td colspan=\"2\">Moyenne la plus basse</td><td colspan=\"2\">Moyenne Generale</td><td colspan=\"2\">Moyenne la plus haute</td></tr>";
                            tabHtml +="<tr><td>"+listeMatiere[j]+"</td><td colspan=\"2\">"+min+"</td><td colspan=\"2\">"+moyMat+"</td><td colspan=\"2\">"+max+"</td></tr>";
                        }

                    } // ueCourant != ueNote

                    else {


                        var listeMoy = Note.find({UE:ueCourant,matiere:listeMatiere[j]});
                        var tabMoy = [];
                        Note.find({UE:ueCourant,matiere:listeMatiere[j],promo:promoCourante.promotion}).forEach(function (listeMoy) {
                            if(listeMoy.note != null) {
                                tabMoy.push(listeMoy.note);
                            }
                        });
                        if(tabMoy.length>0){
                            for(var k =0;k<tabMoy.length;k++) {
                                moyMat+=tabMoy[k];
                            }
                            moyMat = moyMat/tabMoy.length;
                            moyMat = Math.round(moyMat*100)/100;
                        }
                        tabMoy.sort(compare);
                        var min = tabMoy[0];
                        var max = tabMoy[tabMoy.length-1];
                        if (moyMat==0) {
                            tabHtml +="<tr><td>"+listeMatiere[j]+"</td><td colspan=\"2\"></td><td colspan=\"2\"></td><td colspan=\"2\"></td></tr>";
                        }
                        else {
                            tabHtml +="<tr><td>"+listeMatiere[j]+"</td><td colspan=\"2\">"+min+"</td><td colspan=\"2\">"+moyMat+"</td><td colspan=\"2\">"+max+"</td></tr>";
                        }
                    } // else
                } // for matiere
                tabMoyGen.sort(compareInverse);
                tabHtml += "<tr class=\"rowToClick2\"><td colspan=\"6\"><b><i>Classement des étudiants</i></b></td></tr>";
                tabHtml+="<tr style=\"background-color:#CCCCFF\"><td>Nom</td><td colspan=\"2\">Prenom</td><td colspan=\"2\">Moyenne Generale</td><td colspan=\"2\">Classement</td></tr>";
                for(var l = 0; l<tabMoyGen.length;l++) {
                    var idEtudiant = Moyenne.findOne({UE:tabSem[i],moyenne:tabMoyGen[l],promotion:promoCourante.promotion}).id_etu;
                    var etudiant = Etudiant.findOne({_id:idEtudiant});
                    var classement = l+1;
                    classement.toString();
                    if(classement=="1"){
                        classement+="er";
                    }
                    else {
                        classement +="eme";
                    }

                    tabHtml +="<tr><td>"+etudiant.nom+"</td><td colspan=\"2\">"+etudiant.prenom+"</td><td colspan=\"2\">"+tabMoyGen[l]+"</td><td colspan=\"2\">"+classement+"</td></tr>";

                }
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


/*
 for ( var j = 0; j<=listeMatiere.length;j++) {
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
 */