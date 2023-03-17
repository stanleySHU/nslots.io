export interface KHttpServiceOptions {
    spin: () => Promise<any>
}

export interface KSigninOptions {
    isFun: boolean,
    operator: string,
    token: string
}

export class HttpSerice implements KHttpServiceOptions {
    request(url, config?) {
        fetch(url)
    } 
    
    signIn(options: KSigninOptions) {
        if (options.isFun) {
    
        } else {
    
        }
    }
    
    getBalance() {
    
    }
    
    getBets() {
        
    }
    
    spin() {
        return fetch("http://localhost:5000/spin/1")
        .then((response) => response.json());
    }
    
    bonus() {
    
    }
    
    claimFround() {
    
    }
    
    custom() {
    
    }
}