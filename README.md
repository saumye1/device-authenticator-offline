  # device-authenticator-offline
Authenticates proximity of a device from a user based on a password that changes every 30 seconds. The password is available on the device even when the device is not connected to any network.

  # How the idea works?
The idea is to generate a password(or OTP) seed for each user as he signs up, using his device details and some secret associated with it. Now a function is assumed to be generating passwords using this seed and current time on the device(synced with server time). So, when a user wants a third party app to authorize its device, the third party app hits our API and we tell them if the OTP is valide or not.

  # Future Plan
Why would a third party app want to trust us for their security? Because we would use blockchain to validate the device for the first time, and every time the OTP would be authenticated on blockchain or tangle(to increase the speed of operation).
