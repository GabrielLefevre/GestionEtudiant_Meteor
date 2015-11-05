/*
TODO

Lire la ligne 1 de maniere différente pour recuperer les infos sur la promo, la matiere, l'ue et le semestre => OK
Compter le nombre d'etudiant inscris a ce cours => OK
Verifier qu'il y a autant d'ajout que d'étudiant sinon le faire remarquer => OK
Faire la difference entre ajout et modificiation de moyenne => OK
Dire les etudiants sans note (apres ajout) => a completer
exemple de fichier:


 ANDROID	2014-2015	UE41C
 Lefevre	Gabriel	12	M
 Dubus	Damien	13	O
 Dupont	Alex	16	O
 */
Template.note.events({
	'click .add': function(e) {
		e.preventDefault();
		// On recupère le contenu du textarea
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


			var nbr_colonne = 4;
			var indent="\t"; // code ASCII = 9
			var back="\n"; // code ASCII = 13
			var j=3;
			var data=textarea.split(/[\t,\n]+/);
			var matiere = data[0];
			var promo = data[1];
			var ue = data[2];
			var semestre = UE.findOne({nom:ue}).semestre;
			var nbr_etu_list = nbr_ligne-1;
			var nbr_etu_DB= Etudiant.find({promotion:promo, semestre:semestre}).count();

			alert("etudiant inscris au cour dans la DB : " + nbr_etu_DB);
			alert ("nbr ligne etu : " + nbr_etu_list);
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
						// On crée un objet JS avec les donn�es mise dans le tableau etu[]
						var note = {
							nom:etu[0],
							prenom:etu[1],
							promo:promo,
							UE:ue,
							matiere:matiere,
							note:etu[2]
						}
						if (etu[3]=="M") {
							var noteTmp = Note.findOne({nom:etu[0],prenom:etu[1],promo:promo,UE:ue,matiere:matiere});
							idTmp = noteTmp._id;
							Note.update(_id=idTmp,{$set:{note:etu[2]}});
						}
						else {
							Note.insert(note);
						}
						// On cherche l'�tudiant a qui on doit attribuer une note et on modifie son document
						//var etuTmp = Etudiant.findOne({nom: etu[0], prenom: etu[1]});
						//idTmp = etuTmp._id;
						//Etudiant.update(_id=idTmp,{$push:{note:note}});
					} // for i
				} // if confirm
			}


	}
});