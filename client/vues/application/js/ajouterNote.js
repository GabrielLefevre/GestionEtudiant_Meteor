/*
 ----------------------------------------------------------
 -----------------Template note----------------------------
 ----------------------------------------------------------
 */
Template.note.events({
	'click .add': function(e) {
		e.preventDefault();
		// On recupère le contenu du textarea & on compte le nombre de ligne du document.
		var textarea = $("textarea[id='textarea']").val();
		// On compte le nombre de ligne du textarea
		var nbr_ligne = 1;
		var nbr_char_ligne = 0;
		var nbr_char_on_ligne = 150;
		for(var i = 0;i<textarea.length;i++){
			if(textarea.charCodeAt(i) == 10){
				nbr_ligne++;
				nbr_char_ligne = 0;
			}else{
				nbr_char_ligne++;
				if(nbr_char_ligne>nbr_char_on_ligne){
					nbr_ligne++;
					nbr_char_ligne = 1;
				} // if
			} // else
		} // for

        /*
         chaque élément séparé d'une tabulation va être stocké dans un tableau data
         On récupère les éléments de la premieres ligne pour avoir l'information sur la matiere, la promotion, l'ue
        */
        var nbr_colonne = 3;
        var indent="\t"; // code ASCII = 9
        var back="\n"; // code ASCII = 13
        var j=3;
        var data=textarea.split(/[;,\n]+/);
        var mat = data[0];
        var promo = data[1];
        var ue = data[2];
        var nbr_etu_list = nbr_ligne-1;
        /*
        On regarde le semestre auquel correspond l'ue et on regarde combien d'étudiant de la
        Base de Données sont inscris à ce cours.

         */
        var semestre = UE.findOne({nom:ue}).semestre;
        var nbr_etu_DB= Etudiant.find({promotion:promo, semestre:semestre}).count();

        /*
        Selon le nombre d'étudiant dans la BDD et le nombre d'étudiant de la lsite
        on va ou retourner une erreur ou mettre a jour la Collection Note,
        a chaque ajout d'une note pour un étudiant, la moyenne de ses UE et sa moyenne générale et recalculé
         */
        if (nbr_etu_DB<nbr_etu_list) {
            alert("vous n'avez pas autant d'étudiant inscris à ce cours dans la base de données ! \n" +
            "nombre d'étudiant inscris dans la BDD : " + nbr_etu_DB  + "\n nombre d'étudiant dans la liste a ajouter : "+ nbr_etu_list);
            Router.go('/note');
        }
        else if ( nbr_etu_DB >= nbr_etu_list) {
            if (confirm("Vous allez entrer  " + nbr_etu_list + " note d'étudiant pour les " + nbr_etu_DB + " étudiants inscris à ce cours dans la base de données, continuer ?")) {
                var etu=[];
                var cpt = 0;
                /*
                On recupère chaque ligne dans un tableau etu[] pour pouvoir traiter les ajouts de note
                 */

                for (var i=1;i<nbr_ligne;i++) {
                    var cpt1 = cpt+1;
                    var cpt2= cpt+2;
                    for (var k=0;k<nbr_colonne;k++) {
                        etu[k]=data[j];
                        j++;
                    }

                    var id_etu = Etudiant.findOne({nom:etu[cpt], prenom:etu[cpt1],promotion:promo})._id; // l'id de l'étudiant concerné
                    /*
                    On recherche dans la BDD le document correspondant à la matière de l'étudiant que l'on souhaite modifier et on ajoute la note
                     */
                    var noteTmp = Note.findOne({nom:etu[cpt],prenom:etu[cpt1],promo:promo,UE:ue,matiere:mat});
                    idTmp = noteTmp._id;
                    Note.update(_id=idTmp,{$set:{note:parseFloat(etu[cpt2])}});

                    var semCourant = UE.findOne({nom:ue}).semestre; // semestre courant
                    var matiere =Matiere.findOne({semestre:semCourant}).matiere; // tableau des matieres
                    var coeff = Matiere.findOne({semestre:semCourant}).coeff; // tableau des coeff
                    var sommeMoyMatiere = 0;
                    var sommeCoeffMatiere = 0;
                    var listeUE = Semestre.findOne({nom:semCourant}).UE; // tableau des UE de ce semestre
                    var k=0;
                    var moyenne=0;
                    var tabMoy = [];
                    var tabCoeff = [];
                    /*
                    On parcourt toute les matières de chaque UE pour pouvoir calculer les moyennes des UE et la moyenne générale du semestre
                    On va verifier que des notes ont deja été entrée dans un UE sinon on laisse la moyenne a null et on ne la prends pas en compte
                    pour le calcul de la moyenne du semestre
                     */
                    for(var l =0;l<=matiere.length;l++) {
                        if(l==matiere.length) {
                            if(sommeCoeffMatiere == 0 ){
                                moyenne = null;
                            }
                            else {
                                moyenne = sommeMoyMatiere/sommeCoeffMatiere;
                                moyenne = Math.round(moyenne*100)/100;
                                tabMoy[k]=moyenne;
                                tabCoeff[k]=UE.findOne({nom:listeUE[k]}).coeff;
                            }
                            var moyenneTmp = Moyenne.findOne({id_etu:id_etu,UE:listeUE[k]});
                            var id_moy = moyenneTmp._id;
                            Moyenne.update(_id=id_moy,{$set:{moyenne:moyenne}});

                        }

                        else {
                            var noteMat = Note.findOne({id_etu:id_etu,matiere:matiere[l]}).note; // on recupere la note du document actuel
                            var ueNote = Note.findOne({id_etu:id_etu,matiere:matiere[l]}).UE; // on regarde a quel UE appartient la note sur laquel nous sommes
                           /*
                           Si au cours de notre parcours des note nous arrivons a des note d'un nouvel UE on calcul sa moyenne et on passe a l'UE suivant
                           Si aucune note n'a deja été entrée dans un UE on laisse la valeur de la moyenne a null
                            */
                            if(listeUE[k]!=ueNote) {
                                if(sommeCoeffMatiere == 0 ){
                                    moyenne = null;
                                }
                                else {
                                    moyenne = sommeMoyMatiere/sommeCoeffMatiere;
                                    moyenne = Math.round(moyenne*100)/100;
                                    tabMoy[k]=moyenne;
                                    tabCoeff[k]=UE.findOne({nom:listeUE[k]}).coeff;
                                }
                                var moyenneTmp = Moyenne.findOne({id_etu:id_etu,UE:listeUE[k]});
                                var id_moy = moyenneTmp._id;
                                Moyenne.update(_id=id_moy,{$set:{moyenne:moyenne}});
                                k++;
                                sommeMoyMatiere =0;
                                sommeCoeffMatiere = 0;
                                if(noteMat!=null) {
                                    sommeCoeffMatiere += coeff[l];
                                    sommeMoyMatiere += noteMat*coeff[l];
                                }

                            } //

                            else if(noteMat!=null){
                                sommeCoeffMatiere += coeff[l];
                                sommeMoyMatiere += noteMat*coeff[l];
                            }
                        }
                    } // for
                    /*
                    On calcul la moyenne générale d'un semestre, on ne prend en compte que les UE ayant deja au moins une
                    note a leur actif
                     */
                    var moySem = 0;
                    var sommeCoeff = 0;
                    for (var m = 0;m<tabMoy.length;m++) {
                            moySem += tabMoy[m]*tabCoeff[m];
                            sommeCoeff +=parseInt(tabCoeff[m]);
                    }
                    moySem= moySem/sommeCoeff;
                    moySem = Math.round(moySem*100)/100;
                    var semTmp = Moyenne.findOne({id_etu:id_etu,UE:semCourant});
                    var id_Sem = semTmp._id;
                    Moyenne.update(_id=id_Sem,{$set:{moyenne:moySem}});
                } // for i
            } // if confirm
        }


	}
});
