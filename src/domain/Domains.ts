
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