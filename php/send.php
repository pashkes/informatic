<?php
if ($_POST) {
  // Enter the email where you want to receive the message
  $emailTo = 'sales@wattdev.ru';

  $name = addslashes(trim($_POST['callback-name']));
  $tel = addslashes(trim($_POST['callback-tel']));
  $comment = addslashes(trim($_POST['callback-comment']));


  $headers = "Content-type:text/plain;charset=utf-8" . "\r\n" .
	"From: feedback@wattdev.ru" . "\r\n";
  $subject = "Customer request: ". $name .", ".$tel;
  $emailMessage = "Name: " . $name . "\r\n". "Tel: " . $tel . "\r\n". "Comment: " . $comment;
  mail($emailTo, $subject, $emailMessage, $headers);

  echo json_encode($array);
}
?>

