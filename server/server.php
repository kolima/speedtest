<?php

mb_internal_encoding('UTF-8');

// The connection must be closed after each response. Allowing the client to correctly estimate the network latency.
header('Connection: close');

if (!empty($_GET['module']) && $_GET['module'] == 'download') {

    // The response should never be cached or even stored on a hard drive.
    header('Cache-Control: no-cache, no-store, no-transform');
    header('Pragma: no-cache'); // Support for HTTP 1.0.

    // Disable gzip compression on Apache configurations.
    if (function_exists('apache_setenv')) {
        apache_setenv('no-gzip', '1');
    }

    // Define a size for the response: 20MB for the moment, will be dynamic in the future.
    $contentSize = 20 * 1024 * 1024;

    // Provide a base string which will be provided as a response to the client.
    $baseString = 'This text is so uncool, deal with it. ';
    $baseLength = mb_strlen($baseString);

    // Output the string as much as necessary to reach the required size.
    for ($i = 0 ; $i < intval($contentSize / $baseLength) ; $i++) {
        echo $baseString;
    }

    // If necessary, complete the response to fully reach the required size.
    if (($lastBytes = $contentSize % $baseLength) > 0) {
        echo substr($baseString, 0, $lastBytes);
    }

}