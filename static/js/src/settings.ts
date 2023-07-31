// in production we want to set this off to avoid throwing errors
// to end users
let DEBUG = true;

function ASSERT(condition: boolean){
    if(DEBUG && !condition){
        throw new Error("assertion failed");
    }
}

function ASSERT_MSG(condition: boolean,text: string ){
    if(DEBUG && !condition){
        throw new Error(text);
    }
}

// this must only be used in function that return void
function CHECK_RET(falseCondition: boolean){
    if(!falseCondition){
        return;
    }
}

// this assertion works event in debug mode
function CHECK_MSG<T>(falseCondition: boolean, type : T, msg: string): T | void{
    if(!falseCondition){

        if(DEBUG){
            console.log(msg);
            throw new Error(msg); 
        }
        return type;
    }
}

function FAIL(msg: string){
    if(DEBUG){
        console.log("faild");
        throw new Error(msg);
    }
}