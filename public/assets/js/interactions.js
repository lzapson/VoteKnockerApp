$(document).ready(function () {

  

    $("#add-interactions-button").on("click", function () {
        var interactionsObj = {
            AlphaVoterId: $('#id').text(),
            voterId: $('#voterId').text(),
            knock: $('input[name=knock]:checked').val(),
            handOutLit:$('input[name=literature]:checked').val(),
            signPetition: $('input[name=petition]:checked').val(),
            email: $('#extraEmail').val().trim(),
            phone: $("#extraPhone").val().trim(),    
        }
        $.post("/api/interactions", interactionsObj, function (voterId) {
            console.log("voterid",voterId);
            window.location.assign("../status/" + voterId);
           
        });

    });


});


