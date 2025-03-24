import {Ollama} from 'ollama'
import {MultiModalData, MultiModalTrainData, MLLMData, Message} from '../domain/Domains';
import * as fs from "node:fs";
import trainDataRepository from '../repository/trainDataRepository';

class OllamaService {

    private invalidAnswer = ["\r\n", "\n"];
    private ollama = new Ollama({host: 'http://172.27.6.8:11435'})
    private trainDataRepository

    constructor() {
        this.trainDataRepository = new trainDataRepository();
    }

    async generate(uuid: string, model: string, system: string, prompt: string, image: string) {

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
        if (fs.existsSync(outputFilePath)) {
            console.log(`이미 저장된 파일입니다.: ${outputFilePath}`);
        } else {
            const cleanedBase64 = base64String.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(cleanedBase64, 'base64');
            fs.writeFileSync(outputFilePath, imageBuffer);
            console.log(`파일이 저장되었습니다: ${outputFilePath}`);
        }
    }

    async generateWithRetry(uuid: string, data: MultiModalData, retryCount: number) {

        let answer = "";
        while (retryCount > 0) {
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

    addTrainData(trainId: string, data: MultiModalTrainData) {

        this.trainDataRepository.setWithLock(trainId, JSON.stringify(data.toJson()));
    }

    getTrainData(trainId: string) {

        return this.trainDataRepository.get(trainId);
    }

    async generateTrainData(trainId: string) {

        const values = await this.trainDataRepository.get(trainId);
        const datas = JSON.parse(values);
        const result = []
        this.makeFolder(`${__dirname}/../public/images/${trainId}`);
        this.makeFolder(`${__dirname}/../public/images/${trainId}/images`);
        for (const data of datas) {
            Object.setPrototypeOf(data, MultiModalTrainData.prototype);
            console.log(data.instruction, data.response);
            const uuid = data.instructionId;
            const image = data.image;
            const imagePath = `${__dirname}/../public/images/${trainId}/images/${uuid}.jpg`;
            this.saveBase64Image(image, imagePath);
            data.image = `images/${trainId}/images/${uuid}.jpg`;
            result.push(data.toJson());
        }

        const allData = JSON.stringify(result, (key, value) => {
            if (key === 'instructionId') {
                return undefined; // 'instructionId' 키를 제외
            }
            return value;
        })
        console.log(allData)
        return this.makeJsonTrainDataFile(`${__dirname}/../public/images/${trainId}/${trainId}.json`, allData);
    }

    makeJsonTrainDataFile(filePath: string, jsonString: string) {
        fs.writeFileSync(filePath, jsonString, 'utf8');
    }

    makeFolder(folder: string) {
        //폴더 삭제
        try {
            if(fs.existsSync(folder)){
                fs.rmSync(folder, {recursive : true});
            }
        } catch (err) {
            console.error('에러 발생:', err);
        }

        try {
            // 폴더 생성
            fs.mkdirSync(folder);
        } catch (err) {
            console.error('에러 발생:', err);
        }
    }

    async generateMLLMTrainData(trainId: string) {
        const userRole: string = "user";
        const imageTag: string = "<image>";
        const assistantRole: string = "assistant";

        const values = await this.trainDataRepository.get(trainId);
        const datas = JSON.parse(values);
        const result: string[] = []
        this.makeFolder(`${__dirname}/../public/images/${trainId}`);
        this.makeFolder(`${__dirname}/../public/images/${trainId}/images`);
        for (const data of datas) {
            Object.setPrototypeOf(data, MultiModalTrainData.prototype);
            const subSet = new MLLMData();

            const _user_messages = new Message();
            _user_messages.content = imageTag + data.instruction
            _user_messages.role = userRole;
            subSet.messages = _user_messages;

            const _assistant_messages = new Message();
            _assistant_messages.content = data.response
            _assistant_messages.role = assistantRole;
            subSet.messages = _assistant_messages;

            const uuid = data.instructionId;
            const image = data.image;
            const imagePath = `${__dirname}/../public/images/${trainId}/images/${uuid}.jpg`;
            this.saveBase64Image(image, imagePath);
            subSet.images = `images/${uuid}.jpg`;

            result.push(subSet.toJson());
        }

        return this.makeJsonTrainDataFile(`${__dirname}/../public/images/${trainId}/${trainId}.json`, JSON.stringify(result));
    }

}

export default OllamaService;