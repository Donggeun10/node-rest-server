import {Ollama} from 'ollama'
import {MultiModalData} from '../domain/Domains';
import * as fs from "node:fs";

class OllamaService {

    private invalidAnswer = ["\r\n", "\n"];
    private ollama = new Ollama({host: 'http://172.27.6.8:11435'})
    
    constructor() {
    }

    async generate(uuid: string, model: string, system : string , prompt : string, image : string) {

        const imagePath = `${__dirname}/../public/images/${uuid}.jpg`;
        this.saveBase64Image(image, imagePath);
        
        const options = {
            temperature: 0.5,
        }

        const response = await this.ollama.generate({
            model: model,
            system: system,
            prompt: prompt,
            images: [imagePath],
            options: options,
            stream: true,
        })
        let answer = "";
        for await (const part of response) {
            answer = answer.concat(part.response);
            console.log(answer);
        }
        
        return answer;
    }

    saveBase64Image(base64String: string, outputFilePath: string): void {
        // 만약 Base64 문자열이 "data:image/jpeg;base64," 형태라면, 접두사를 제거합니다.
        if(fs.existsSync(outputFilePath)){
            console.log(`이미 저장된 파일입니다.: ${outputFilePath}`);
        }else {
            const cleanedBase64 = base64String.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(cleanedBase64, 'base64');
            fs.writeFileSync(outputFilePath, imageBuffer);
            console.log(`파일이 저장되었습니다: ${outputFilePath}`);
        }
    }

    async generateWithRetry(uuid: string, data: MultiModalData, retryCount: number) {

        let answer = "";
        while(retryCount > 0) {
            answer = await this.generate(uuid, data.model, data.system, data.prompt, data.image);
            if (this.invalidAnswer.filter(invalid => answer === invalid).length > 0 && retryCount > 0) {
                console.log(`재시도: ${retryCount}, 응답: ${answer}`);
                retryCount--;
            } else {
                console.log(`최종 응답: ${answer}`);
                break;
            }
        }
        return answer;
    }

}

export default OllamaService;