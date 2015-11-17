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
            var nbr_char_on_ligne = 180;
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
            var j=0;
            var data=textarea.split(/[;,\n]+/);
            var etu=[];

            for (var i=0;i<nbr_ligne;i++) {
                for (var k=0;k<nbr_colonne;k++) {
                    etu[k]=data[j];
                    j++;
                }
                alert("nom : " + etu[0] + " prenom : " + etu[1] + " groupe : " + etu[2] + " promo : " + etu[3] + " mail : " + etu[4]);
                alert("adresse : " + etu[5] + " cp : " + etu[6] + " ville : " + etu[7] + " semestre : " + etu[8]);
                // On verifie l'existence de la promotion dans la BDD sinon on la crée
                if ( Promotion.find({promotion:etu[3]}).count()>0) {
                    Etudiant.insert({nom:etu[0],prenom:etu[1],groupe:etu[2],promotion:etu[3],mail:etu[4],adresse:etu[5],cp:etu[6],ville:etu[7],semestre:[etu[8]]});
                } // if
                else {
                    var promo = {
                        promotion:etu[3]
                    }
                    Promotion.insert(promo);
                    Etudiant.insert({nom:etu[0],prenom:etu[1],groupe:etu[2],promotion:etu[3],mail:etu[4],adresse:etu[5],cp:etu[6],ville:etu[7],semestre:etu[8]});
                } // else
                var id = Etudiant.findOne({nom:etu[0],prenom:etu[1],groupe:etu[2],promotion:etu[3]})._id;
                var UEsem = Semestre.findOne({nom:etu[8]}).UE;
                for (var l =0; l<UEsem.length;l++){
                    var moy = {
                        id_etu : id,
                        UE:UEsem[l],
                        moyenne:"non renseignée"
                    }
                    Moyenne.insert(moy);
                    var matiere =UE.findOne({nom:UEsem[l]}).matiere; // tableau des matieres
                    for (var m =0;m<matiere.length;m++) {
                        var note = {
                            nom:etu[0],
                            prenom:etu[1],
                            promo:etu[3],
                            id_etu:id,
                            UE:UEsem[l],
                            matiere:matiere[m],
                            note:"non renseignée"
                        }
                        Note.insert(note);
                    }
                } //for l
                var moySem = {
                    id_etu : id,
                    UE:etu[8],
                    moyenne:"non renseignée"
                }
                Moyenne.insert(moySem);
            } // for i

        }
    }
});