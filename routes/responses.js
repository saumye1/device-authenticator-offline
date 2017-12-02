exports.invalidParametersResponse = function(res) {
    return res.send(JSON.stringify({
        message : "Invalid Parameters",
        status : 100,
        data : {}
    }))
}

exports.actionCompleteResponse = function(res, data) {
    return res.send(JSON.stringify({
        message : "Successful",
        status : 200,
        data : data || {}
    }))
}