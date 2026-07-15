type TWheelItemProps = {
  label: string | number;
  value: string | number;
  options?: TWheelItemProps[] | null;
};

type TParallelItemsProps = TWheelItemProps[][];
type TCascadeItemsProps = TWheelItemProps[];

type TPickerValueProps = Omit<TWheelItemProps, 'options'>;

type TSlidePickerType = {
  visible: boolean;
  wheels?: number;
  values: TWheelItemProps[];
  dataSource: TParallelItemsProps | TCascadeItemsProps;

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
  onConfirmClick?: (result: TWheelItemProps[]) => void;

  HeaderComponent?: React.ReactNode;
};
