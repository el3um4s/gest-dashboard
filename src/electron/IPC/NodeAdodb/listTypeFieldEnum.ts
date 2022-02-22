type TypeField = {
    value: number;
    constant: string;
    description: string;
}

const listTypeFieldEnum: Array<TypeField> = [
    { value: 8192, constant: "adArray", description: "Array" },
    { value: 20, constant: "adBigInt", description: "BigInt" },
    { value: 128, constant: "adBinary", description: "Binary" },
    { value: 11, constant: "adBoolean", description: "Boolean" },
    { value: 8, constant: "adBSTR", description: "BSTR" },
    { value: 136, constant: "adChapter", description: "Chapter" },
    { value: 129, constant: "adChar", description: "Char" },
    { value: 6, constant: "adCurrency", description: "Currency" },
    { value: 7, constant: "adDate", description: "Date" },
    { value: 133, constant: "adDBDate", description: "DBDate" },
    { value: 134, constant: "adDBTime", description: "DBTime" },
    { value: 135, constant: "adDBTimeStamp", description: "DBTimeStamp" },
    { value: 14, constant: "adDecimal", description: "Decimal" },
    { value: 5, constant: "adDouble", description: "Double" },
    { value: 0, constant: "adEmpty", description: "Empty" },
    { value: 10, constant: "adError", description: "Error" },
    { value: 64, constant: "adFileTime", description: "FileTime" },
    { value: 72, constant: "adGUID", description: "GUID" },
    { value: 9, constant: "adIDispatch", description: "IDispatch" },
    { value: 3, constant: "adInteger", description: "Integer" },
    { value: 13, constant: "adIUnknown", description: "IUnknown" },
    { value: 205, constant: "adLongVarBinary", description: "LongVarBinary" },
    { value: 201, constant: "adLongVarChar", description: "LongVarChar" },
    { value: 203, constant: "adLongVarWChar", description: "LongVarWChar" },
    { value: 131, constant: "adNumeric", description: "Numeric" },
    { value: 138, constant: "adPropVariant", description: "PropVariant" },
    { value: 4, constant: "adSingle", description: "Single" },
    { value: 2, constant: "adSmallInt", description: "SmallInt" },
    { value: 16, constant: "adTinyInt", description: "TinyInt" },
    { value: 21, constant: "adUnsignedBigInt", description: "UnsignedBigInt" },
    { value: 19, constant: "adUnsignedInt", description: "UnsignedInt" },
    { value: 18, constant: "adUnsignedSmallInt", description: "UnsignedSmallInt" },
    { value: 17, constant: "adUnsignedTinyInt", description: "UnsignedTinyInt" },
    { value: 132, constant: "adUserDefined", description: "UserDefined" },
    { value: 204, constant: "adVarBinary", description: "VarBinary" },
    { value: 200, constant: "adVarChar", description: "VarChar" },
    { value: 12, constant: "adVariant", description: "Variant" },
    { value: 139, constant: "adVarNumeric", description: "VarNumeric" },
    { value: 202, constant: "adVarWChar", description: "VarWChar" },
    { value: 130, constant: "adWChar", description: "WChar" },
];

export function getTypeDescription(value: number):string {
    const typeField: TypeField = listTypeFieldEnum.filter( el => el.value == value)[0];
    return typeField.description;
}
