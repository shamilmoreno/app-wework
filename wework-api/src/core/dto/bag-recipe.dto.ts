import { IsDateString, IsNumber, IsNotEmpty } from "class-validator";

export class BagRecipeDto {
  @IsDateString()
  @IsNotEmpty()
  monthRecipeBag: string;

  @IsNumber()
  @IsNotEmpty()
  numberBags: number;

  @IsNumber()
  @IsNotEmpty()
  operatingExpense: number;

  @IsNumber()
  @IsNotEmpty()
  maquila: number;

  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @IsNumber()
  @IsNotEmpty()
  commission: number;
}
