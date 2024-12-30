import { Observable, ReplaySubject } from 'rxjs';
import { IContent } from '../services/model/content';

declare var MathJax: any;
declare var window: any;

export class EFUtil {
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static convertFileToBase64(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(window.btoa(event.target.result.toString()));
    return result;
  }

  static async getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  static renderMathJaxElementBySelectorId(
    content: IContent,
    selectorId: string
  ) {
    if (content.contentType === 'TEXT') {
      setTimeout(() => {
        const preview: any = document.getElementById(selectorId);
        if (preview) {
          preview.innerHTML = content.data;

          /* MathJax v2 */
          // MathJax.Hub.Queue(["Typeset", MathJax.Hub, preview]);

          /** MathJax v3 */
          MathJax.startup.promise; // make sure initial typesetting has taken place
          MathJax.typesetClear([preview]); // clear MathJax awareness of this element
          MathJax.typesetPromise([preview]); // typeset anew

          // window.com.wiris.js.JsPluginViewer.parseElement(
          //   preview,
          //   true,
          //   function () {}
          // );
        }
      }, 0);
    }
  }

  static contentPanelStyles(c: any, type: string = '') {
    return {
      'nw-line': c.startPosition == 'NEW_LINE',
      'fw-bold': !this.validateHTML(c.data) && c.isBold,
      'fst-italic': c.isItalic,
      'text-decoration-underline': c.isUnderlined,
      'v-align-base': c.verticalAlignment == 'baseline',
      'v-align-sub': c.verticalAlignment == 'subscript',
      'v-align-super': c.verticalAlignment == 'superscript',
      /* ...(type == 'tbl' && {
                'align-end': c.horizontalAlignment == "RIGHT",
                'align-center': c.horizontalAlignment == "CENTER"
            }), */
    };
  }


  static validateHTML(htmlString: string) {
    /* let parser = new DOMParser();
    let doc = parser.parseFromString(htmlString, 'application/xml');
    let errorNode = doc.querySelector('parsererror');
    return errorNode; */
    const regexForHTML = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;

    return regexForHTML.test(htmlString);
  }

  static setTblHorizontalAlignment(contents: any[]) {
    if (contents.length > 0) {
      return contents[0].horizontalAlignment?.toLowerCase();
    }
    return '';
  }

  static renderImage(content: any) {
    let url: any;
    try {
      url = new URL(content.data);
    } catch (_) {
      return `data:${content.type};base64,${content.data}`;
    }
    return content.data;
  }

  static setListStyle(listStle: string) {
    switch (listStle) {
      case 'lowerRoman':
        return 'lower-roman';
      case 'upperRoman':
        return 'upper-roman';
      case 'decimal':
        return 'decimal';
      case 'lowerLetter':
        return 'lower-alpha';
      case 'upperLetter':
        return 'upper-alpha';
      case 'bullet':
        return 'disc';
      default:
        return '';
    }
  }
}
