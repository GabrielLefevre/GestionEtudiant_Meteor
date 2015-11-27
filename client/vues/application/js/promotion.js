/*
 ----------------------------------------------------------
 -----------------Template carnetPromo---------------------
 ----------------------------------------------------------
 */
Template.carnetPromo.helpers({
/*
Fonction qui va générer le tableau HTML de chaque semestre ou la promotion est inscrire
Pour y faire figurer ses informations tel que la moyenne générale, le classement,
les meilleures et pires moyenne de chaque matière
 */


    infoSemestre: function () {
        function compare(x, y) {
            return x - y;
        }
        function compareInverse(x, y) {
            return y - x;
        }

        var promoCourante = Promotion.findOne({_id:this._id}); // la promotion courante avec laquelle nous travaillons

        // On commence par parcourir la Collection Semestre et on stocke dans un tableau tout les noms des semestres existant
        var sem = Semestre.find();
        var tabSem = [];
        Semestre.find().forEach(function (sem) {
            tabSem.push(sem.nom);
        });

        var tabHtml = ""; // variable qui va contenir le tableau HTML du semestre
        /*
        On va parcourir chaque semestre existant et generer un tableaux si ua moins une note d'étudiant y figure
         */
        for (var i = 0; i < tabSem.length; i++) {
            var listeUE = Semestre.findOne({nom: tabSem[i]}).UE; // LA liste des UE du semestre
            var listeMatiere = Matiere.findOne({semestre:tabSem[i]}).matiere; // La liste des matieres du semestre
            var listeCoeff = Matiere.findOne({semestre:tabSem[i]}).coeff; // tableau des coeff des matières
            var ueCourant = " "; // l'UE courant
            var moyGen = 0;
            /*
            On vérifie qu'au moins une note a déjà été rentrée dans ce semestre pour le créer sinon nous passons au semestre suivant
             */
            if (Note.find({UE: listeUE[0], promo: promoCourante.promotion}).count() > 0) {
                /*
                On va récuperer la liste des documents des moyennes generale de ce semestre et les stocker dans un tableaux pour pouvoir
                les réutiliser, notemment pour y faire la moyenne et trouver la plus petite et la plus grande
                 */
                var listeMoyGen = Moyenne.find({UE:tabSem[i],promo:promoCourante.promotion}); // liste des documents contenants les moyenne du semestre
                var tabMoyGen =[];
                Moyenne.find({UE:tabSem[i],promotion:promoCourante.promotion}).forEach(function (listeMoyGen) {
                    if(listeMoyGen.moyenne != null) {
                        tabMoyGen.push(listeMoyGen.moyenne);
                    }

                });
                /*
                Si au moins une note est rentrée on calcul la moyenne du semestre de la promo
                 */
                if(tabMoyGen.length>0){
                    for(var k =0;k<tabMoyGen.length;k++) {
                        moyGen+=tabMoyGen[k];
                    }
                    moyGen = moyGen/tabMoyGen.length;
                    moyGen = Math.round(moyGen*100)/100;
                }
                /*
                une fois le tableau rempli on va le trier et en sortir les deux extremes ( + grande et + petite )
                 */
                tabMoyGen.sort(compare);
                var minGen = tabMoyGen[0];
                var maxGen = tabMoyGen[tabMoyGen.length-1];

                /*
                On crée l'entête du tableau HTML, et la premiere section "Generale" ou figure la moyenne générale et les
                deux extrêmes calculés ci dessus
                 */

                tabHtml +="<div class=\"panel panel-primary filterable\"><div class=\"panel-heading\">";
                tabHtml += "<h3 class=\"panel-title\">"+tabSem[i]+"</h3><p></p>";
                tabHtml +="<a class=\"btn btn-info\" onClick=\"colorier"+i+"();\">Color</a></div>";
                tabHtml +="<table class=\"table\" id=\"table"+i+"\" name=\"table\"><tbody>";
                tabHtml+="<tr class=\"rowToClick2\"><td colspan=\"6\"><b><i>General</i></b></td></tr>";
                tabHtml+="<tr style=\"background-color:#CCCCFF\"><td></td><td colspan=\"2\">Moyenne la plus basse</td><td colspan=\"2\">Moyenne Generale</td><td colspan=\"2\">Moyenne la plus haute</td></tr>";
                tabHtml +="<tr><td>Moyenne generale</td><td colspan=\"2\">"+minGen+"</td><td colspan=\"2\">"+moyGen+"</td><td colspan=\"2\">"+maxGen+"</td></tr>";
                /*
                On va maintenant parcourir le tableau des matières pour afficher la moyenne de la matiere,
                la plus petite note et la plus grande.
                A chaque nouvel UE nous allons lui créer une entete avec la moyenne generale de cet UE
                 */
                for ( var j = 0; j<listeMatiere.length;j++) {
                    var ueNote = Note.findOne({matiere:listeMatiere[j],promo:promoCourante.promotion}).UE;
                    var moyMat = 0;
                    var moyUE = 0;
                    /*
                    Si la matière en cours n'appartient pas a l'UE courant définie plus haut nous allons d'abord calculer
                    la moyenne de l'UE puis afficher en dessous ses différnetes matières
                     */
                    if(ueNote != ueCourant) {
                        ueCourant = ueNote;
                        var listeMoyUE = Moyenne.find({UE:ueCourant,promo:promoCourante.promotion}); // la liste des documents des moyenne de l'UE
                        /*
                         On va récuperer la liste des documents des moyennes generale de cet UE et les stocker dans un tableaux pour pouvoir
                         les réutiliser, notemment pour y faire la moyenne
                         */
                        var tabMoyUE =[];
                        Moyenne.find({UE:ueCourant,promotion:promoCourante.promotion}).forEach(function (listeMoyUE) {
                            if(listeMoyUE.moyenne != null) {
                                tabMoyUE.push(listeMoyUE.moyenne);
                            }

                        });
                        /*
                         Si au moins une note est rentrée on calcul la moyenne de l'UE de la promo
                         */
                        if(tabMoyUE.length>0){
                            for(var k =0;k<tabMoyUE.length;k++) {
                                moyUE+=tabMoyUE[k];
                            }
                            moyUE = moyUE/tabMoyUE.length;
                            moyUE = Math.round(moyUE*100)/100;
                        }


                        var listeMoy = Note.find({UE:ueCourant,matiere:listeMatiere[j]}); // la liste des documents des notes de chaque matière
                        /*
                         On va récuperer la liste des documents des notes de la matière et la stocker dans un tableaux pour pouvoir
                         les réutiliser, notemment pour y faire la moyenne et trouver la plus petite et la plus grande
                         */
                        var tabMoy = [];
                        Note.find({UE:ueCourant,matiere:listeMatiere[j],promo:promoCourante.promotion}).forEach(function (listeMoy) {
                            if(listeMoy.note != null) {
                                tabMoy.push(listeMoy.note);
                            }

                        });
                        /*
                         Si au moins une note est rentrée on calcul la moyenne de cette matière pour la promo
                         */
                        if(tabMoy.length>0){
                            for(var k =0;k<tabMoy.length;k++) {
                                moyMat+=tabMoy[k];
                            }
                            moyMat = moyMat/tabMoy.length;
                            moyMat = Math.round(moyMat*100)/100;
                        }
                        /*
                        On trie le tableau des notes de la matière pour pouvoir en sortir les deux extrêmes
                         */
                        tabMoy.sort(compare);
                        var min = tabMoy[0];
                        var max = tabMoy[tabMoy.length-1];
                        /*
                        On affecte à la variable contenent le tableau HTML l'entête de l'UE et ses résultats si il en possède
                        ainsi qui la premiere matiere de l'UE
                         */
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
                    /*
                    Comme pour au dessus nous allons calculer la moyenne de cette matiere pour la promo ainsi que sortir ses deux extremes
                     */
                    else {
                        var listeMoy = Note.find({UE:ueCourant,matiere:listeMatiere[j]}); // la liste des documents des notes de chaque matière
                        /*
                         On va récuperer la liste des documents des notes de la matière et la stocker dans un tableaux pour pouvoir
                         les réutiliser, notemment pour y faire la moyenne et trouver la plus petite et la plus grande
                         */
                        var tabMoy = [];
                        Note.find({UE:ueCourant,matiere:listeMatiere[j],promo:promoCourante.promotion}).forEach(function (listeMoy) {
                            if(listeMoy.note != null) {
                                tabMoy.push(listeMoy.note);
                            }
                        });
                        /*
                         Si au moins une note est rentrée on calcul la moyenne de cette matière pour la promo
                         */
                        if(tabMoy.length>0){
                            for(var k =0;k<tabMoy.length;k++) {
                                moyMat+=tabMoy[k];
                            }
                            moyMat = moyMat/tabMoy.length;
                            moyMat = Math.round(moyMat*100)/100;
                        }
                        /*
                         On trie le tableau des notes de la matière pour pouvoir en sortir les deux extrêmes
                         */
                        tabMoy.sort(compare);
                        var min = tabMoy[0];
                        var max = tabMoy[tabMoy.length-1];
                        /*
                        On affecte a la variable tabHTML la ligne de tableau concernant la matière et ses résultats, si elle
                        en possède
                         */
                        if (moyMat==0) {
                            tabHtml +="<tr><td>"+listeMatiere[j]+"</td><td colspan=\"2\"></td><td colspan=\"2\"></td><td colspan=\"2\"></td></tr>";
                        }
                        else {
                            tabHtml +="<tr><td>"+listeMatiere[j]+"</td><td colspan=\"2\">"+min+"</td><td colspan=\"2\">"+moyMat+"</td><td colspan=\"2\">"+max+"</td></tr>";
                        }
                    } // else
                } // for matiere
                /*
                On va trier les moyennes générales des étudiants pour pouvoir les classer en bas de tableau
                 */
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

                    tabHtml +="<tr><td><a  href=\"/etudiant/"+etudiant._id+"\">"+etudiant.nom+"</a></td><td colspan=\"2\"><a  href=\"/etudiant/"+etudiant._id+"\">"+etudiant.prenom+"</a></td><td colspan=\"2\">"+tabMoyGen[l]+"</td><td colspan=\"2\">"+classement+"</td></tr>";

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
Fonction de passage au semestre suivant
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
        var promo = Promotion.findOne({promotion: this.promotion}).promotion; // la promotion actuelle
        // On rentre les lignes du textarea dans un tableau temporaire
        if (confirm("Inscrire les " + nbr_ligne + " étudiants au prochain semestre ? ")) {
            var nbr_colonne = 4;
            var j = 0;
            var data = textarea.split(/[;,\n]+/);
            var etu = [];

            /*
            On va traiter les lignes une par une et affecter chaque étudiant a son nouveau semestre
             */
            for (var i = 0; i < nbr_ligne; i++) {
                for (var k = 0; k < nbr_colonne; k++) {
                    etu[k] = data[j];
                    j++;
                }
                var idEtu = Etudiant.findOne({nom: etu[0], prenom: etu[1], promotion: promo})._id; // l'id de l'étudiant concerné par le passage au semestre suivant
                /*
                On modifie le document de l'étudiant avec le nom de son nouveau semestre et son avis décidé par le jury
                 */
                Etudiant.update({_id: idEtu}, {$push: {semestre: etu[2]}});
                Etudiant.update({_id: idEtu}, {$push: {avis: etu[3]}});

                /*
                On va maintenant devoir créer les documents des notes et moyennes de l'étudiant pour son nouveau semestre
                 */
                var UEsem = Semestre.findOne({nom: etu[2]}).UE; // la liste des UE du semestre
                /*
                On va créer un document Moyenne pour chaque UE de ce semestre par étudiant
                 */
                for (var k = 0; k < UEsem.length; k++) {
                    /*
                    On vérifie avant qu'un document a son nom n'existe pas deja dans le cas ou il serait un redoublant ayant deja validé l'UE
                     */
                    if(Moyenne.find({id_etu: idEtu, promotion:promo,UE: UEsem[k]}).count()==0) {
                        var moy = {
                            id_etu: idEtu,
                            promotion:promo,
                            UE: UEsem[k],
                            moyenne: null
                        }
                        Moyenne.insert(moy);
                    }
                    /*
                    On va créer un document Note pour chaque matière de ce semestre pour chaque étudiant
                     */
                    var matiere = UE.findOne({nom: UEsem[k]}).matiere; // tableau des matieres
                    for (var l = 0; l < matiere.length; l++) {
                        /*
                         On vérifie avant qu'un document a son nom n'existe pas deja dans le cas ou il serait un redoublant ayant deja validé l'UE
                         */
                        if(Note.find({nom: etu[0],prenom: etu[1],promo: promo, id_etu: idEtu,UE: UEsem[k],matiere: matiere[l]}).count()==0) {
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

                    }
                } //for k
                /*
                On va enfin créer un document Moyenne pour y afficher la moyenne générale du semestre
                mais nous vérifions d'abord que ce document n'existe pas deja dans le cas ou l'étudiant à validé
               le semestre
                 */
                if(Moyenne.find({id_etu: idEtu,promotion:promo,UE: etu[2],}).count()==0) {
                    var moySem = {
                        id_etu: idEtu,
                        promotion:promo,
                        UE: etu[2],
                        moyenne: null
                    }
                    Moyenne.insert(moySem);
                }


            } // for i

        } // if confirm


    },
    /*
    Fonction qui traite les cas de redoublement d'étudiant
    chaque ligne contient l'étudiant concerné, sa nouvelle promotion, son semestre
    de destination et les UE qu'il a deja validé pour sa nouvelle année
     */
    'click .redoublement': function (e) {
        e.preventDefault();
        // On recupère le contenu du textarea
        var textarea = $("textarea[id='redoublement']").val();
        var promo = Promotion.findOne({promotion: this.promotion}).promotion;
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
        var promo = Promotion.findOne({promotion: this.promotion}).promotion; // la promotion ou était l'étudiant avant son redoublement
        // On rentre les lignes du textarea dans un tableau temporaire
        if (confirm("Faire redoubler les " + nbr_ligne + " étudiants ? ")) {
            var data = textarea.split(/[\n]+/);
            var etu = [];
            var k = 0;
            for (var i = 0; i < nbr_ligne; i++) {
                etu[k]=data[i];
                var tabDonnee = etu[k].split(";");
                k++;
                var etudiantRedoublant = Etudiant.findOne({nom:tabDonnee[0],prenom:tabDonnee[1],promotion:promo}); // l'étudiant redoublant
                var promoDestination = tabDonnee[2]; // la nouvelle promotion
                var semestreDestination = tabDonnee[3]; // son nouveau semestre
                // On verifie l'existence de la promotion dans la BDD sinon on la crée
                if ( Promotion.find({promotion:promoDestination}).count()==0) {
                    var newPromo = {
                        promotion:promoDestination
                    }
                    Promotion.insert(newPromo);
                }
                Etudiant.update({_id:etudiantRedoublant._id}, {$push: {avis: "redoublement"}}); // on met a jour l'avis de l'étudiant avant son redoublement
                /*
                On va dupliquer le document de l'étudiant en modifiant sa promotion et en remplacant le tableau des semestre
                 */
                var newEtudiant = {
                    nom:tabDonnee[0],
                    prenom:tabDonnee[1],
                    promotion:promoDestination,
                    mail:etudiantRedoublant.mail,
                    adresse:etudiantRedoublant.adresse,
                    cp:etudiantRedoublant.cp,
                    ville:etudiantRedoublant.ville,
                    photo:etudiantRedoublant.photo,
                    avis:[],
                    semestre:[semestreDestination]
                }
                Etudiant.insert(newEtudiant);
                var idEtu = Etudiant.findOne({nom:tabDonnee[0],prenom:tabDonnee[1],promotion:promoDestination})._id; // l'id de l'étudiant dans sa nouvelle promotion
                /*
                On va parcourir les UE validé et crée un document dans les collections Moyenne et Note pour lui attribuer ses résusltats
                 */
                for (var j = 4;j<tabDonnee.length;j++) {
                    /*
                    On duplique sa moyenne de son UE actuel et on l'ajoute dans la collection Moyenne mais sous l'id
                    du redoublant
                     */
                    var moyUE = {
                        id_etu: idEtu,
                        promotion:promoDestination,
                        UE: tabDonnee[j],
                        moyenne: Moyenne.findOne({id_etu:etudiantRedoublant._id,promotion:promo,UE:tabDonnee[j]}).moyenne
                    }
                    Moyenne.insert(moyUE);
                    if(tabDonnee[j]!="aucun"){
                        /*
                        On va maintenant duppliquer les résultats des matières des UE validés
                         */
                        var matiere = UE.findOne({nom: tabDonnee[j]}).matiere; // tableau des matieres
                        for (var l = 0; l < matiere.length; l++) {
                            var noteSave = Note.findOne({nom:tabDonnee[0],prenom:tabDonnee[1],promo:promo,UE:tabDonnee[j],matiere:matiere[l]}).note;
                                var note = {
                                    nom: tabDonnee[0],
                                    prenom: tabDonnee[1],
                                    promo: promoDestination,
                                    id_etu: idEtu,
                                    UE: tabDonnee[j],
                                    matiere: matiere[l],
                                    note: noteSave
                                }
                                Note.insert(note);
                        }

                    }// if aucun UE validé
                } // for j
                var UEsem = Semestre.findOne({nom: semestreDestination}).UE; // la liste des UE du semestre de destination
                /*
                On va maintenant créer un document vide pour toute les matieres et les UE que l'étudiant doit repasser
                 */
                for (var n = 0; n < UEsem.length; n++) {
                    /*
                    On vérifie que le document n'existe pas deja au cas ou il l'aurait validé
                     */
                    if(Moyenne.find({id_etu: idEtu, promotion:promoDestination,UE: UEsem[n]}).count()==0) {
                        var moy = {
                            id_etu: idEtu,
                            promotion:promoDestination,
                            UE: UEsem[n],
                            moyenne: null
                        }
                        Moyenne.insert(moy);
                    }

                    var matiere = UE.findOne({nom: UEsem[n]}).matiere; // tableau des matieres
                    for (var m = 0; m < matiere.length; m++) {
                        if(Note.find({nom: tabDonnee[0],prenom: tabDonnee[1],promo: promoDestination, id_etu: idEtu,UE: UEsem[n],matiere: matiere[m]}).count()==0) {
                            var note = {
                                nom: tabDonnee[0],
                                prenom: tabDonnee[1],
                                promo: promoDestination,
                                id_etu: idEtu,
                                UE: UEsem[n],
                                matiere: matiere[m],
                                note: null
                            }
                            Note.insert(note);
                        }

                    }
                } //for n
                /*
                Enfin, on crée un document dans Moyenne pour sa moyenne generale du semestre
                 */
                if(Moyenne.find({id_etu: idEtu,promotion:promoDestination,UE: semestreDestination}).count()==0) {
                    var moySem = {
                        id_etu: idEtu,
                        promotion:promoDestination,
                        UE: semestreDestination,
                        moyenne: null
                    }
                    Moyenne.insert(moySem);
                }

            } // for i
        } // if
    }
});