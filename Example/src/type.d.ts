type IWheelItemProps = {
  label: string | number;
  value: string | number;
  options?: IWheelItemProps[] | null;
};

type IParallelItemsProps = IWheelItemProps[][];
type ICascadeItemsProps = IWheelItemProps[];

type IPickerValueProps = Omit<IWheelItemProps, 'options'>;

type SlidePickerType = {
  visible: boolean;
  wheels: number;
  values: IWheelItemProp[];
  data: IParallelItemsProps | ICascadeItemsProps;

  onMaskClick?: () => void;

  animationDuration?: number;

  checkRange?: 3 | 5 | 7;
  itemHeight?: number;

  contentBackgroundColor?: string;
  itemDividerColor?: string;
  checkedTextStyle?: TextStyle;
  normalTextStyle?: TextStyle;

  titleText?: string;
  titleTextStyle?: TextStyle;
  cancelText?: string;
  cancelTextStyle?: TextStyle;
  onCancelClick?: () => void;
  confirmText?: string;
  confirmTextStyle?: TextStyle;
  onConfirmClick?: (result: IWheelItemProps[]) => void;

  HeaderComponent?: React.ReactNode;
};
