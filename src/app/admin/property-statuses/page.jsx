import Property from '../../../../lib/models/Property';
import PropertyStatus from '../../../../lib/models/PropertyStatus';
import connectDB from '../../../../lib/mongodb';
import PropertyStatusClient from './PropertyStatusClient';

export async function getPropertyStatuses() {
    try {
        await connectDB();

        const statuses = await PropertyStatus.find({})
            .sort({ name: 1 }) // Simplified sorting since sortOrder is removed
            .lean();

        return statuses.map(status => ({
            ...status,
            _id: status._id.toString(),
            id: status._id.toString(),
            createdAt: status.createdAt?.toISOString(),
            updatedAt: status.updatedAt?.toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching property statuses:', error);
        return [];
    }
}

// Server Actions
async function createPropertyStatus(formData) {
    'use server';

    try {
        await connectDB();

        // Check if name or slug already exists
        const existing = await PropertyStatus.findOne({
            $or: [
                { name: formData.get('name') },
                { slug: formData.get('slug') }
            ]
        });

        if (existing) {
            return { error: 'Property status with this name or slug already exists' };
        }

        const status = await PropertyStatus.create({
            name: formData.get('name'),
            slug: formData.get('slug'),
            icon: formData.get('icon') || '',
            color: formData.get('color') || '#6b7280',
        });

        return {
            success: true,
            data: {
                ...status.toObject(),
                _id: status._id.toString(),
                id: status._id.toString(),
            }
        };
    } catch (error) {
        console.error('Error creating property status:', error);
        return { error: error.message };
    }
}

async function updatePropertyStatus(id, formData) {
    'use server';

    try {
        await connectDB();

        // Check if name or slug already exists (excluding current)
        const existing = await PropertyStatus.findOne({
            $and: [
                { _id: { $ne: id } },
                {
                    $or: [
                        { name: formData.get('name') },
                        { slug: formData.get('slug') }
                    ]
                }
            ]
        });

        if (existing) {
            return { error: 'Property status with this name or slug already exists' };
        }

        const status = await PropertyStatus.findByIdAndUpdate(
            id,
            {
                name: formData.get('name'),
                slug: formData.get('slug'),
                icon: formData.get('icon') || '',
                color: formData.get('color') || '#6b7280',
            },
            { new: true, runValidators: true }
        );

        if (!status) {
            return { error: 'Property status not found' };
        }

        return {
            success: true,
            data: {
                ...status.toObject(),
                _id: status._id.toString(),
                id: status._id.toString(),
            }
        };
    } catch (error) {
        console.error('Error updating property status:', error);
        return { error: error.message };
    }
}

async function deletePropertyStatus(id) {
    'use server';

    try {
        await connectDB();

        // Check if status is being used by any properties
        const propertiesCount = await Property.countDocuments({ statusId: id });

        if (propertiesCount > 0) {
            return { error: `Cannot delete: ${propertiesCount} properties are using this status. Please update those properties first.` };
        }

        await PropertyStatus.findByIdAndDelete(id);

        return { success: true };
    } catch (error) {
        console.error('Error deleting property status:', error);
        return { error: error.message };
    }
}

export default async function PropertyStatusesPage() {
    const statuses = await getPropertyStatuses();

    return (
        <PropertyStatusClient
            initialStatuses={statuses}
            createPropertyStatus={createPropertyStatus}
            updatePropertyStatus={updatePropertyStatus}
            deletePropertyStatus={deletePropertyStatus}
        />
    );
}