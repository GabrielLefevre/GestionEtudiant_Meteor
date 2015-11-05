Meteor.publish("allEtudiantsHeaders", function(){
    return Etudiant.find({}, {
        fields: {content: 0}
    });
});