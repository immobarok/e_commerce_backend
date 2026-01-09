import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    private readonly maxSizeInBytes: number;

    constructor(maxSizeInMB: number = 5) {
        this.maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
    }

    transform(value: any) {
        if (!value) {
            return value;
        }

        // Handle single file
        if (value.buffer) {
            this.validateFileSize(value);
            return value;
        }

        // Handle multiple files (object with arrays)
        if (typeof value === 'object') {
            Object.keys(value).forEach((key) => {
                const files = value[key];
                if (Array.isArray(files)) {
                    files.forEach((file) => this.validateFileSize(file, key));
                }
            });
        }

        return value;
    }

    private validateFileSize(file: Express.Multer.File, fieldName?: string) {
        if (file.size > this.maxSizeInBytes) {
            const maxSizeInMB = (this.maxSizeInBytes / (1024 * 1024)).toFixed(2);
            const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
            const field = fieldName ? ` (${fieldName})` : '';

            throw new BadRequestException(
                `File${field} "${file.originalname}" is too large. ` +
                `Size: ${fileSizeInMB}MB, Maximum allowed: ${maxSizeInMB}MB`
            );
        }
    }
}
