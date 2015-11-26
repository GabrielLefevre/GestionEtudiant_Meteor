Template.semestre.events({
    'submit form': function(e){
		e.preventDefault();

		//On récupère toute les données du formulaire
		var nomSemestre = $("input[name='nomSemestre']").val();
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
				tabCoeffUE1[i]=parseInt($("input[name='UE1coeff" + i + "']").val());
				i++;
			}
			if(document.getElementById("UE2matiere" +j)) {
				tabMatUE2[j]=$("input[name='UE2matiere" + j + "']").val();
				tabCoeffUE2[j]=parseInt($("input[name='UE2coeff" + j + "']").val());
				j++;
			}
			if(document.getElementById("UE3matiere" +k)) {
				tabMatUE3[k]=$("input[name='UE3matiere" + k + "']").val();
				tabCoeffUE3[k]=parseInt($("input[name='UE3coeff" + k + "']").val());
				k++;
			}	
		} // while
		/*
		On va créer un document pour chaque matière du semestre
		 */
		var matTmp = tabMatUE1.concat(tabMatUE2);
		var matiereSemestre = matTmp.concat(tabMatUE3);
        var coeffTmp = tabCoeffUE1.concat(tabCoeffUE2);
        var coeffMatiere = coeffTmp.concat(tabCoeffUE3);
        var matiere ={
            semestre:nomSemestre,
            matiere:matiereSemestre,
            coeff:coeffMatiere
        }
        Matiere.insert(matiere);
		// On crée l'objet qui servira de patron et on le rempli avec les information necessaire
		var semestre = {
			nom: nomSemestre,
			UE:[]
		}
        var coeffUE1 = 0;
        var coeffUE2 = 0;
        var coeffUE3 = 0;
        for (var i =0;i<tabCoeffUE1.length;i++) {
            coeffUE1 += tabCoeffUE1[i];
        }
        for (var i =0;i<tabCoeffUE2.length;i++) {
            coeffUE2 += tabCoeffUE2[i];
        }
        for (var i =0;i<tabCoeffUE3.length;i++) {
            coeffUE3 += tabCoeffUE3[i];
        }
		// On ajoute le modèle a la base auquel on va ajouter les UE et les matieres en parcourant chaque tableaux de matiere et ce pour chaque UE
		Semestre.insert(semestre, function(err,res) {
			var idSemestre = res;
			var UE1TMP = {
				nom:nomUE1,
				semestre:nomSemestre,
                coeff: coeffUE1,
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
                coeff:coeffUE2,
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
                coeff:coeffUE3,
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
  }// supprimer

});