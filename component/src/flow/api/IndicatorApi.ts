import { isIndicatorColorScheme } from '@app/flow/diagram/Indicator';
import Store from '@app/flow/store/Store';


enum INDICATOR_API_ERRORS {
  INDICATOR_NOT_FOUND = 'INDICATOR_NOT_FOUND',
  INDICATOR_WRONG_VALUE_TYPE = 'INDICATOR_WRONG_VALUE_TYPE',
  INDICATOR_WRONG_COLOR_SCHEME = 'INDICATOR_WRONG_COLOR_SCHEME',
}

export default class IndicatorApi {
  public static ERRORS = INDICATOR_API_ERRORS;

  public getIndicatorValue: (id: string) => number;
  public setIndicatorValue: (id: string, value: any, colorScheme: any) => void;

  constructor(store: Store) {
    this.getIndicatorValue = (id: string) => {
      const indicator = store.indicators.find((it) => it.id === id);
      if (!indicator) {
        throw new Error(IndicatorApi.ERRORS.INDICATOR_NOT_FOUND);
      }

      return indicator.getValue();
    };

    this.setIndicatorValue = (id: string, value: any, colorScheme?: any) => {
      const indicator = store.indicators.find((it) => it.id === id);
      if (!indicator) {
        throw new Error(IndicatorApi.ERRORS.INDICATOR_NOT_FOUND);
      }

      if (typeof value !== 'number' || value < 0) {
        throw new Error(IndicatorApi.ERRORS.INDICATOR_WRONG_VALUE_TYPE);
      }

      if (colorScheme && !isIndicatorColorScheme(colorScheme)) {
        throw new Error(IndicatorApi.ERRORS.INDICATOR_WRONG_COLOR_SCHEME);
      }

      indicator.setValue(value, colorScheme);
    };
  }
}
