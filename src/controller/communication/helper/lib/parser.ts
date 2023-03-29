import { isEmpty } from 'lodash';
interface Fildes {
  COMPONENT_DELIMITER: string;
  ESCAPE_DELIMITER: string;
  FIELD_DELIMITER: string;
  NEW_LINE: string;
  REPEAT_DELIMITER: string;
  SUB_COMPONENT_DELIMITER: string;
}

export class Parser {
  _blockStart: any;
  _blockEnd: any;
  _fileds: Fildes;
  _instrumentType = '';

  constructor(interfaceManager) {
    this._blockStart = !isEmpty(interfaceManager.blockStart)
      ? interfaceManager.blockStart
          .replace(/&amp;/g, '&')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&quot;/g, '"')
          .replace(/â/g, '’')
          .replace(/â¦/g, '…')
          .toString()
      : undefined;
    this._blockEnd = !isEmpty(interfaceManager.blockEnd)
      ? interfaceManager.blockEnd
          .replace(/&amp;/g, '&')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&quot;/g, '"')
          .replace(/â/g, '’')
          .replace(/â¦/g, '…')
          .toString()
      : undefined;
    // array to object
    const object = {};
    interfaceManager.fileds.map(
      (item) =>
        (object[item.filed] = item.value
          .replace(/&amp;/g, '&')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&quot;/g, '"')
          .replace(/â/g, '’')
          .replace(/â¦/g, '…')
          .toString()),
    );
    this._fileds = object as Fildes;
    this._instrumentType = interfaceManager.instrumentType;
  }

  parseSegment = (data) => {
    const fields = data.split(this._fileds.FIELD_DELIMITER);
    const firstElement = fields.shift();
    const item = {
      fields: firstElement,
      values: [firstElement].concat(fields),
    };
    return item;
  };

  parse = (data: any) => {
    switch (this._instrumentType) {
      case 'ERP':
      case 'ERP_REG': {
        if (data.slice(0, 3) !== 'MSH') return null;
        break;
      }
      case 'URISED': {
        if (data.slice(0, 4) !== this._blockStart) return null;
        if (data.slice(data.length - 12) !== this._blockEnd) return null;
        data = data.slice(4, -12);
        break;
      }
      case 'HORIBA_H550': {
        if (data.slice(0, 5) !== this._blockStart) return null;
        if (data.slice(data.length - 9) !== this._blockEnd) return null;
        data = data.slice(5, -9);
        break;
      }
      case 'SYSMEX XP-100': {
        if (data.slice(0, 1) !== 'h') {
          data = 'h|' + data.split('h|')[1];
        }
        break;
      }
    }
    const result: any = [];
    const NEW_LINE = new RegExp(this._fileds.NEW_LINE);
    const segments = data.split(NEW_LINE);
    for (const segment of segments) {
      if (segment === '') {
        continue;
      }
      const segmentItem = segment.replace(/  +/g, '');
      const seg = this.parseSegment(segmentItem);
      result.push(seg);
    }
    return result;
  };

  parseString = (data) => {
    if (!data || typeof data !== 'string') {
      return null;
    }
    data = this.parse(data);
    return data;
  };
}
