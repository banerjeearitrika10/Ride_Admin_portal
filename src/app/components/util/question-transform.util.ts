import { IAnswer } from "../services/model/answer";
import { IContent } from "../services/model/content";
import { IQuestion } from "../services/model/question";
import { EFUtil } from "./ef.util";

export class QuestionTransformUtil {
    static transform(questionObj: IQuestion) {
        const qRef = { ...questionObj };
        if (qRef.instructions && qRef.instructions.length > 0) {
            qRef.instructions = QuestionTransformUtil.contentMerger(qRef.instructions);
        }
        if (qRef.comprehension && qRef.comprehension.length > 0) {
            qRef.comprehension = QuestionTransformUtil.contentMerger(qRef.comprehension);
        }
        if (qRef.questionContents && qRef.questionContents.length > 0) {
            qRef.questionContents = QuestionTransformUtil.contentMerger(qRef.questionContents);
        }
        if (qRef.solution && qRef.solution.length > 0) {
            qRef.solution = QuestionTransformUtil.contentMerger(qRef.solution);
        }

        if (qRef.answerChoices && qRef.answerChoices.length > 0) {
            qRef.answerChoices.forEach((answerChoice: IAnswer, idx: number) => {
                qRef.answerChoices[idx].answerChoiceContents = QuestionTransformUtil.contentMerger(answerChoice.answerChoiceContents);
            });
        }
        return qRef;
    }

    static contentMerger(list: IContent[]) {
        let isTypeText: boolean = false;
        let sequeceTxtContents: IContent[] = [];
        let finalContents: IContent[] = [];
        for (let content of list) {
            if (content.contentType) {
                if (content.contentType === "TEXT") {
                    if (!isTypeText) {
                        isTypeText = true;
                    }
                    sequeceTxtContents.push(content);
                } else {
                    if (sequeceTxtContents.length > 0) {
                        finalContents.push(QuestionTransformUtil.txtContentMerger(sequeceTxtContents));
                    }
                    finalContents.push(content);
                    sequeceTxtContents = [];
                }
            }
        }
        if (sequeceTxtContents.length > 0) {
            finalContents.push(QuestionTransformUtil.txtContentMerger(sequeceTxtContents));
        }

        return finalContents;
    }

    static txtContentMerger(list: IContent[]) {
        let seqeunceTxt = "";
        let isNewLineStarted: boolean = false;
        let finalData: IContent = { ...list[0] };
        for (let content of list) {
            const isHTMLType = EFUtil.validateHTML(content.data);
            if (!isHTMLType || content.data.indexOf('<math') > -1) {
                let contentStyles = "white-space: pre-wrap;";
                let paraStyles = "";
                if (content.isBold) {
                    contentStyles += "font-weight: bold;"
                }
                if (content.isItalic) {
                    contentStyles += "font-style: italic;"
                }
                if (content.isUnderlined) {
                    contentStyles += "text-decoration: underline;"
                }

                if (content.verticalAlignment === "baseline") {
                    contentStyles += "vertical-align: baseline;";
                } else if (content.verticalAlignment === "subscript") {
                    contentStyles += "vertical-align: sub;font-size:11px";
                    content.data = `<sub>${content.data}</sub>`;
                } else if (content.verticalAlignment === "superscript") {
                    contentStyles += "vertical-align: super;font-size:11px";
                    content.data = `<sup>${content.data}</sup>`;
                }

                if (content.horizontalAlignment === "RIGHT") {
                    paraStyles += "text-align: right;";
                } else {
                    paraStyles += "text-align: left;";
                }

                let spanContentData = `<span style="${contentStyles}">${content.data}</span>`;
                if (content.startPosition === "NEW_LINE" && !isNewLineStarted) {
                    seqeunceTxt += `<div style="${paraStyles}">${spanContentData}`;
                    isNewLineStarted = true;
                } else if (content.startPosition === "NEW_LINE" && isNewLineStarted) {
                    paraStyles += "display: block";
                    seqeunceTxt += `</div><div style="${paraStyles}">${spanContentData}`;
                } else {
                    seqeunceTxt += spanContentData;
                }
            } else {
                seqeunceTxt += content.data;
            }
        }

        if (isNewLineStarted) {
            isNewLineStarted = false;
            seqeunceTxt += `</div>`;
        }
        finalData.data = seqeunceTxt;

        return finalData;
    }
}