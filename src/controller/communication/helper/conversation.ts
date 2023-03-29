import { decode } from './parser';

export const mappingData = async (
  segmentMapping: any,
  interfaceManager: any,
) => {
  const mapping: any[] = [];
  const values: any[] = [];
  for (const item of segmentMapping) {
    if (item.instType === interfaceManager.instrumentType) {
      values.push({
        segments: item.segments,
        field: `${item.segments?.toLowerCase()}.${item.elementName
          ?.toLowerCase()
          .replace(/ /g, '_')}`,
        component: [Number(item.elementNo), 1],
        field_no: Number(item.elementNo),
        mandatory: item.requiredForLims,
        default: '',
      });
    }
  }
  const group = values.reduce((r: any, a: any) => {
    r[a.segments] = [...(r[a.segments] || []), a];
    return r;
  }, {});
  const entries = Object.entries(group);
  for (const item of entries) {
    mapping.push({
      [item[0].toLowerCase() || '']: { values: item[1] },
    });
  }
  return mapping;
};

export const conversation = async (
  type: string,
  segmentMapping,
  interfaceManager,
  message: string,
) => {
  try {
    const mappingList = await mappingData(segmentMapping, interfaceManager);

    const tempData: any = {};
    for (const item of mappingList) {
      for (const key of Object.keys(item)) {
        tempData[key] = item[key];
      }
    }
    const mapping: any = {
      mapping: tempData,
    };
    const output = decode(message, interfaceManager, mapping);
    if (!output) return console.log('Please enter correct message');
    return output;
  } catch (error) {
    return;
  }
};
