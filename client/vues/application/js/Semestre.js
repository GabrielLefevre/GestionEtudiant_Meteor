Template.semestre.events({
    'submit form': function(e){
		e.preventDefault();

		//On récupère toute les données du formulaire
		var nomSemestre = $("input[name='nomSemestre']").val();
		var dd = $("input[name='dateD']").val();
		var df = $("input[name='dateF']").val();
		var nomUE1 = $("input[name='nomUE1']").val();
		var nomUE2 = $("input[name='nomUE2']").val();
		var nomUE3 = $("input[name='nomUE3']").val();
		var i=0;
		var j=0;
		var k=0;
		var  tabMatUE1 = new Array();
		var  tabCoeffUE1 = new Array();
		var  tabMatUE2 = new Array();
		var  tabCoeffUE2= new Array();
		var  tabMatUE3 = new Array();
		var  tabCoeffUE3 = new Array();
		// On enregistre les matieres dans différents tableaux selon les UE
		while(document.getElementById("UE1matiere" +i) || document.getElementById("UE2matiere" +j) || document.getElementById("UE3matiere" +k)) {
			if(document.getElementById("UE1matiere" +i)) {
				tabMatUE1[i]=$("input[name='UE1matiere" + i + "']").val();
				tabCoeffUE1[i]=$("input[name='UE1coeff" + i + "']").val();
				i++;
			}
			if(document.getElementById("UE2matiere" +j)) {
				tabMatUE2[j]=$("input[name='UE2matiere" + j + "']").val();
				tabCoeffUE2[j]=$("input[name='UE2coeff" + j + "']").val();
				j++;
			}
			if(document.getElementById("UE3matiere" +k)) {
				tabMatUE3[k]=$("input[name='UE3matiere" + k + "']").val();
				tabCoeffUE3[k]=$("input[name='UE3coeff" + k + "']").val();
				k++;
			}	
		} // while 
		
		// On crée l'objet qui servira de patron
		var semestre = {
			nom: nomSemestre,
			dateDebut: dd,
			dateFin: df,
			UE:[]
		}
		// On ajoute le modèle a la base auquel on va ajouter les UE et les matieres en parcourant chaque tableaux de matiere et ce pour chaque UE
		Semestre.insert(semestre, function(err,res) {
			var idSemestre = res;
			var UE1TMP = {
				nom:nomUE1,
				semestre:nomSemestre,
				matiere:tabMatUE1
			}
			UE.insert(UE1TMP, function(err, res) {
				var idUE1 = res;
			 var ue1Def = UE.findOne({_id:idUE1});
			Semestre.update({_id:idSemestre}, {$push:{UE:nomUE1}});
		});

			var UE2TMP = {
				nom:nomUE2,
				semestre:nomSemestre,
				matiere:tabMatUE2
			}
			UE.insert(UE2TMP, function(err, res) {
				var idUE2 = res;
				var ue2Def = UE.findOne({_id:idUE2});
				Semestre.update({_id:idSemestre}, {$push:{UE:nomUE2}});
			});

			var UE3TMP = {
				nom:nomUE3,
				semestre:nomSemestre,
				matiere:tabMatUE3
			}
			UE.insert(UE3TMP, function(err, res) {
				var idUE3 = res;
				var ue3Def = UE.findOne({_id:idUE3});
				Semestre.update({_id:idSemestre}, {$push:{UE:nomUE3}});
			});

		});
	   
	}, // formulaire
	
	  'click .delete': function(e) {
		e.preventDefault();

    if (confirm("supprimer le semestre ?")) {
      var semestreCourant = this._id;
      Semestre.remove(semestreCourant);
      Router.go('/semestre');
    }
  }, // supprimer
  
  /*'click .addUE1': function(e){
		e.preventDefault();
		var i = 0
		var contenu1 = ""
		i = i + 1;
		contenu1 = contenu1 + "<label class=\"control-label\">Matiere "+ i + " <input type='text' name='UE1matiere" + i + "' /><br />";
		contenu1 = contenu1 + "<label class=\"control-label\">Coeff Matiere "+ i + " <input type='int' name='UE1coeff" + i + "' /><br />";
		document.getElementById('nouvelle_matiere1').innerHTML = contenu1;
	}, 
	
	  'click .addUE2': function(e){
		e.preventDefault();
		var j = 0
		var contenu2 = ""
		j = j + 1;
		contenu2 = contenu2 + "<label class=\"control-label\">Matiere "+ j + " <input type='text' name='UE2matiere" + j + "' /><br />";
		contenu2 = contenu2 + "<label class=\"control-label\">Coeff Matiere "+ j + " <input type='int' name='UE2coeff" + j + "' /><br />";
		document.getElementById('nouvelle_matiere2').innerHTML = contenu2;
	}, 
	
	  'click .addUE3': function(e){
		e.preventDefault();
		var k = 0
		var contenu3 = ""
		k = k + 1;
		contenu3 = contenu3 + "<label class=\"control-label\">Matiere "+ k + " <input type='text' name='UE3matiere" + k + "' /><br />";
		contenu3 = contenu3 + "<label class=\"control-label\">Coeff Matiere "+ k + " <input type='int' name='UE3coeff" + k + "' /><br />";
		document.getElementById('nouvelle_matiere3').innerHTML = contenu3;
	}*/


});