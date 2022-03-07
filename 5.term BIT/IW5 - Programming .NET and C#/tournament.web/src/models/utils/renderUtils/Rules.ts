
export default interface Rules{
    required?: boolean | undefined | string,
    validate?: () => boolean | string,
    min?: number,
    max?: number
}