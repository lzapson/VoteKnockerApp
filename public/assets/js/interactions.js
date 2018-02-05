$(document).ready(function () {

  

    $("#add-interactions").on("click", function () {
        var interactionsObj = {
            AlphaVoterId: $('#id').text(),
            voterId: $('#voterId').text(),
            knock: $('input[name=knock]:checked').val(),
            handOutLit:$('input[name=literature]:checked').val(),
            signPetition: $('input[name=petition]:checked').val(),
            email: $('#extraEmail').val().trim(),
            phone: $("#extraPhone").val().trim(),    
        }
        $.post("/api/interactions", interactionsObj, function (data) {
            console.log("add interactions successful", data);
        });

    });




});


