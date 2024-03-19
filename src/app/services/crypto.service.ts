import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    constructor(
        private router: Router
    ) {
      
    }

    useHmacSHA256(objJson:any, secret:string) {
        var sha256 = CryptoJS.HmacSHA256(JSON.stringify(objJson), secret);
        var base64encoded = CryptoJS.enc.Base64url.stringify(sha256);
        return base64encoded;
    }

    encryptUsingAES256(obj:any, secret:string) {
        let _key = CryptoJS.enc.Utf8.parse(secret);
        let _iv = CryptoJS.enc.Utf8.parse(secret);
        let encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(obj), _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });
          
          var wordArray = CryptoJS.enc.Utf8.parse(encrypted.toString());
          var base64 = CryptoJS.enc.Base64.stringify(wordArray);
        return base64;
      }
    
      decryptUsingAES256(code:any, secret:string) {    
        var parsedWordArray = CryptoJS.enc.Base64.parse(code);
        var parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    
        let _key = CryptoJS.enc.Utf8.parse(secret);
        let _iv = CryptoJS.enc.Utf8.parse(secret);
    
        return CryptoJS.AES.decrypt(
          parsedStr, _key, {
            keySize: 16,
            iv: _iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString(CryptoJS.enc.Utf8);
      }

      getHash(message:any, secret:string){
        //encript part 1
        const encriptado1 = this.useHmacSHA256(message, secret);
        console.log(encriptado1)

        //encript part 2
        const encriptado2 = this.encryptUsingAES256(message, secret);
        console.log(encriptado2)
        console.log(this.decryptUsingAES256(encriptado2, secret));

        var words = CryptoJS.enc.Utf8.parse(encriptado1  + encriptado2); // WordArray object
        var stringBase64 = CryptoJS.enc.Base64.stringify(words);

        return stringBase64;
      }

      getEncriptMessage(hash:string, secret:string){

        var words = CryptoJS.enc.Base64.parse(hash);
        var decriptyString = CryptoJS.enc.Utf8.stringify(words);

        const text = decriptyString.substring(43, hash.length);
        console.log('text')
        console.log(text)
        return this.decryptUsingAES256(text, secret);
      }
}
