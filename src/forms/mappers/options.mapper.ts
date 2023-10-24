import { Option } from '../types/fields/option';
import { OptionDto } from '../dtos/option.dto';
import { randomUuidv4 } from 'src/utils/generate-uuid';

export function mapOptions(optionDtos: Array<OptionDto>): Array<Option> {
  return optionDtos?.map((optionDto) => {
    const newOption = new Option();
    newOption.id = randomUuidv4();
    newOption.title = optionDto.title;

    return newOption;
  });
}
