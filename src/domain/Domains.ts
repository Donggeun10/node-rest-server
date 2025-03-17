
export class MultiModalData {

    private _image : string = "";
    private _prompt : string = "";
    private _model : string = "";
    private _system : string = "";

    // Getter: _image 프로퍼티의 값을 반환
    get image() : string {
        return this._image;
    }

    // Setter: _image 프로퍼티의 값을 설정
    set image(value : string) {
        if (value.trim() === '') {
            console.log('image에 빈 문자열일 수 없습니다.');
        } else {
            this._image = value;
        }
    }

    // Getter: _prompt 프로퍼티의 값을 반환
    get prompt() : string {
        return this._prompt;
    }

    // Setter: _prompt 프로퍼티의 값을 설정
    set prompt(value : string) {
        if (value.trim() === '') {
            console.log('prompt에 빈 문자열일 수 없습니다.');
        } else {
            this._prompt = value;
        }
    }

    // Getter: _model 프로퍼티의 값을 반환
    get model() : string {
        return this._model;
    }

    // Setter: _model 프로퍼티의 값을 설정
    set model(value : string) {
        if (value.trim() === '') {
            console.log('model에 빈 문자열일 수 없습니다.');
        } else {
            this._model = value;
        }
    }

    // Getter: _system 프로퍼티의 값을 반환
    get system() : string {
        return this._system;
    }

    // Setter: _system 프로퍼티의 값을 설정
    set system(value : string) {
        if (value.trim() === '') {
            console.log('system에 빈 문자열일 수 없습니다.');
        } else {
            this._system = value;
        }
    }

    toJson(): string {
        let json = JSON.stringify(this);
        Object.keys(this).filter(key => key.startsWith("_")).forEach(key => {
            json = json.replace(key, key.substring(1));
        });
        return JSON.parse(json);
    }

}

export class MultiModalTrainData {

    private _instructionId : string = "";
    private _image : string = "";
    private _response : string = "";
    private _instruction : string = "";

    // Getter: _instructionId 프로퍼티의 값을 반환
    get instructionId() : string {
        return this._instructionId;
    }

    // Setter: _instructionId 프로퍼티의 값을 설정
    set instructionId(value : string) {
        if (value.trim() === '') {
            console.log('instructionId에 빈 문자열일 수 없습니다.');
        } else {
            this._instructionId = value;
        }
    }

    // Getter: _image 프로퍼티의 값을 반환
    get image() : string {
        return this._image;
    }

    // Setter: _image 프로퍼티의 값을 설정
    set image(value : string) {
        if (value.trim() === '') {
            console.log('image에 빈 문자열일 수 없습니다.');
        } else {
            this._image = value;
        }
    }

    // Getter: _response 프로퍼티의 값을 반환
    get response() : string {
        return this._response;
    }

    // Setter: _prompt 프로퍼티의 값을 설정
    set response(value : string) {
        if (value.trim() === '') {
            console.log('response에 빈 문자열일 수 없습니다.');
        } else {
            this._response = value;
        }
    }

    // Getter: _instruction 프로퍼티의 값을 반환
    get instruction() : string {
        return this._instruction;
    }

    // Setter: _instruction 프로퍼티의 값을 설정
    set instruction(value : string) {
        if (value.trim() === '') {
            console.log('instruction에 빈 문자열일 수 없습니다.');
        } else {
            this._instruction = value;
        }
    }

    toJson(): string {
        let json = JSON.stringify(this);
        Object.keys(this).filter(key => key.startsWith("_")).forEach(key => {
            json = json.replace(key, key.substring(1));
        });
        return JSON.parse(json);
    }

}