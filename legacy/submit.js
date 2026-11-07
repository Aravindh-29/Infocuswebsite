function sendEmail() {
  var from_mail = "noreply@infocuscs.com"; // Replace with your email address or domain name
  var to = $("#to").val();
  var subject = $("#subject").val();
  if (!$("#terms").is(":checked")) {
    $("#terms").addClass("error");
    return;
  } else {
    $("#terms").removeClass("error");
  }
emailjs.init("5SP5rwUndX6MceHvJ");
  emailjs.send("service_wp7cqpc","template_mt2sumb", {
    from_email: to,
    to_email: "hr@infocuscs.com",
    to_name: "InFocus CS",
    subject: "Form Submission" + " <" + to + ">",
    fname: $("#fname").val(),
    lname: $("#lname").val(),
    industry: $("#subject").val(),
    body: $("#body").val(),
  }).then(
    function (response) {
      Toastify({
        text: "Form Submitted Sucessfully",
        duration: 3000,
        gravity: "bottom",
        position: "center",
      }).showToast();
      $("#my-form")[0].reset();
    },
    function (error) {
      Toastify({
        text: "Error Submitting Form",
        duration: 3000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "red",
      }).showToast();
    }
  );
}

$("#submit").on("click", function (e) {
  e.preventDefault();
  sendEmail();
});
