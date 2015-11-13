/*
TODO

Dire les etudiants sans note (apres ajout) => a completer


exemple de fichier:


 ANDROID	2014-2015	UE41C
 Lefevre	Gabriel	12	M
 Dubus	Damien	13	A
 Dupont	Alex	16	A

 Ajoute une note pour la matière Android de l'ue41c de la promo 2014-2015 pour deux étudiants (A), un étudiant voit sa note modifié (M)
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
        var nbr_colonne = 4;
        var indent="\t"; // code ASCII = 9
        var back="\n"; // code ASCII = 13
        var j=3;
        var data=textarea.split(";");
        var matiere = data[0];
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
        on va ou retourner une erreur ou mettre a jour la Collection Note
         */
        if (nbr_etu_DB<nbr_etu_list) {
            alert("vous n'avez pas autant d'étudiant inscris à ce cours dans la base de données ! \n" +
            "nombre d'étudiant inscris dans la BDD : " + nbr_etu_DB  + "\n nombre d'étudiant dans la liste a ajouter : "+ nbr_etu_list);
            Router.go('/note');
        }
        else if ( nbr_etu_DB >= nbr_etu_list) {
            if (confirm("Vous allez entrer  " + nbr_etu_list + " note d'étudiant pour les " + nbr_etu_DB + " étudiants inscris à ce cours dans la base de données, continuer ?")) {
                var etu=[];
                for (var i=1;i<nbr_ligne;i++) {
                    for (var k=0;k<nbr_colonne;k++) {
                        etu[k]=data[j];
                        j++;
                    }
                    // On crée un objet JSON avec les données mise dans le tableau etu[]
                    var id_etu = Etudiant.findOne({nom:etu[0], prenom:etu[1],promotion:promo})._id;
                    /*
                    On vérifie si l'étudiant doit avoir une note ajouté ou juste une update
                    sur sa note actuelle
                     */
                    if (etu[3]=="M") {
                        var noteTmp = Note.findOne({nom:etu[0],prenom:etu[1],promo:promo,UE:ue,matiere:matiere});
                        idTmp = noteTmp._id;
                        Note.update(_id=idTmp,{$set:{note:etu[2]}});
                    }
                    else {
                        var noteTmp = Note.findOne({nom:etu[0],prenom:etu[1],promo:promo,UE:ue,matiere:matiere});
                        var idTmp = noteTmp._id;
                        Note.update(_id=idTmp,{$set:{note:etu[2]}});
                    }
                    var semCourant = UE.findOne({nom:ue}).semestre;
                    var matiere =Matiere.findOne({semestre:semCourant}).matiere; // tableau des matieres
                    var coeff = Matiere.findOne({semestre:semCourant}).coeff; // tableau des coeff
                    var sommeMoyMatiere = 0;
                    var sommeCoeffMatiere = 0;
                    var listeUE = Semestre.findOne({nom:semCourant}).UE;
                    var k=0;
                    var moyenne;
                    var tabMoy = [];
                    var tabCoeff = [];
                    for(var l =0;l<=matiere.length;l++) {
                        if(l==matiere.length) {
                            moyenne = sommeMoyMatiere/sommeCoeffMatiere;
                            moyenne = moyenne.toFixed(2);
                            moyenne =moyenne+'';
                            tabMoy[k]=moyenne;
                            tabCoeff[k]=UE.findOne({nom:listeUE[k]}).coeff;
                            var moyenneTmp = Moyenne.findOne({id_etu:id_etu,UE:listeUE[k]});
                            var id_moy = moyenneTmp._id;
                            Moyenne.update(_id=id_moy,{$set:{moyenne:moyenne}});
                        }
                        else {
                            var noteMat = Note.findOne({id_etu:id_etu,matiere:matiere[l]}).note;
                            var ueNote = Note.findOne({id_etu:id_etu,matiere:matiere[l]}).UE;
                            if(listeUE[k]!=ueNote) {

                                moyenne = sommeMoyMatiere/sommeCoeffMatiere;
                                moyenne = moyenne.toFixed(2);
                                tabMoy[k]=moyenne;
                                moyenne =moyenne+'';
                                tabCoeff[k]=UE.findOne({nom:listeUE[k]}).coeff;
                                var moyenneTmp = Moyenne.findOne({id_etu:id_etu,UE:listeUE[k]});
                                var id_moy = moyenneTmp._id;
                                Moyenne.update(_id=id_moy,{$set:{moyenne:moyenne}});
                                k++;
                                sommeMoyMatiere =0;
                                sommeCoeffMatiere = 0;
                                if(noteMat!="non renseignée") {
                                    sommeCoeffMatiere += parseInt(coeff[l]);
                                    sommeMoyMatiere += parseFloat(noteMat)*parseInt(coeff[l]);
                                }
                                else {
                                    alert("pas encore de note pour "+ matiere[l]);
                                }

                            }

                            else if(noteMat!="non renseignée"){
                                sommeCoeffMatiere += parseInt(coeff[l]);
                                sommeMoyMatiere += parseFloat(noteMat)*parseInt(coeff[l]);
                            }
                            else {
                                alert("pas encore de note pour "+ matiere[l]);
                             }
                        }
                    } // for
                    var moySem = 0;
                    var sommeCoeff = 0;
                    alert(tabMoy + " "+ tabCoeff);
                    for (var m = 0;m<3;m++) {
                        moySem += tabMoy[m]*parseInt(tabCoeff[m]);
                        sommeCoeff +=parseInt(tabCoeff[m]);
                    }
                    alert ( moySem + " "+sommeCoeff);
                    moySem= moySem/sommeCoeff;
                    moySem = moySem.toFixed(2);
                    moySem =moySem+'';
                    var semTmp = Moyenne.findOne({id_etu:id_etu,UE:semCourant});
                    var id_Sem = semTmp._id;
                    Moyenne.update(_id=id_Sem,{$set:{moyenne:moySem}});
                } // for i
            } // if confirm
        }


	}
});