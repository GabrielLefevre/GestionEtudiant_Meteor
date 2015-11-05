/**
 * Created by Gabriel on 26/10/2015.
 */
Template.inscription.events({
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

        // On rentre les lignes du textarea dans un tableau temporaire
        if (confirm("Ajouter la promotion ?")) {
            var nbr_colonne = 9;
            var indent="\t"; // code ASCII = 9
            var back="\n"; // code ASCII = 13
            var j=0;
            var data=textarea.split(/[\t,\n]+/);
            var etu=[];
            for (var i=0;i<nbr_ligne;i++) {
                for (var k=0;k<nbr_colonne;k++) {
                    etu[k]=data[j];
                    j++;
                }
                // On recherche le semestre renseigné dans la BDD et on ajoute cet étudiant a la BDD avec son semestre en cours
                var sem= Semestre.findOne({nom: etu[8]});
                // On verifie l'existence de la promotion dans la BDD sinon on la crée
                if ( Promotion.find({promotion:etu[3]}).count()>0) {
                    Etudiant.insert({nom:etu[0],prenom:etu[1],groupe:etu[2],promotion:etu[3],mail:etu[4],adresse:etu[5],cp:etu[6],ville:etu[7],semestre:etu[8]});
                } // if
                else {
                    var promo = {
                        promotion:etu[3]
                    }
                    Promotion.insert(promo);
                    Etudiant.insert({nom:etu[0],prenom:etu[1],groupe:etu[2],promotion:etu[3],mail:etu[4],adresse:etu[5],cp:etu[6],ville:etu[7],semestre:etu[8]});
                } // else

            } // for i
            // On crée la promotion dans sa collection

        }
    }
});