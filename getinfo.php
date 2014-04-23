<?php if(!$_REQUEST['acct']) exit;

//echo $_REQUEST['acct'];
	
//https://203.177.52.163:1984/restgateway/services/ws_outageschedulebyaccountid/8615900000

header('content-type: application/json');

$api_url = "https://203.177.52.163:1984/restgateway/services/ws_outageschedulebyaccountid/";

$json = file_get_contents($api_url . $_REQUEST['acct']);

echo $json;

?>