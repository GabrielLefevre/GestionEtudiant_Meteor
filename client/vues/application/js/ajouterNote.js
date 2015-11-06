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
        var data=textarea.split(/[\t,\n]+/);
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
                    var note = {
                        nom:etu[0],
                        prenom:etu[1],
                        promo:promo,
                        id_etu:id_etu,
                        UE:ue,
                        matiere:matiere,
                        note:etu[2]
                    }
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
                        Note.insert(note);
                    }
                } // for i
            } // if confirm
        }


	}
});